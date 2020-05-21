//AWS Bucketname: martinpaul-msg-socialnetwork
/* To check the images on aws, go to
https://s3.console.aws.amazon.com/s3/buckets/martinpaul-msg-socialnetwork/
*/

const express = require("express");
const app = express();
//SOCKET.IO setup
const server = require("http").Server(app); //socket.io needs a native node server (we can't use express's node server because express altered it a bit, so we use the Server constructor here and pass it "app" so that the express still works)
const io = require("socket.io")(server, { origins: "localhost:8080" }); //you need to pass socket.io the serv and origins with a list of host-names/ports that you will accept socket io connections from (there will be a http header with 'origin' value in it. it also prevents cross-site attacks. you separate multiple ports by a space)
//when you upload to heroku, add the route to origins: "localhost:8080 mysocialnetwork.herokuapp.com:example")
const db = require("./db");
const { hash, compare } = require("./bc");
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const c = require("crypto-random-string");
const { sendEmail } = require("./ses");
const s3 = require("./s3");

//////////////////////// DON'T TOUCH below - IMAGE UPLOAD BIOLDERPLATE /////////////////////////////
//npm packages we installed
const multer = require("multer"); //saves our files to our harddrive
const uidSafe = require("uid-safe"); //creates random string to give each file a unique name
//core node module
const path = require("path");

const diskStorage = multer.diskStorage({
    //where on harddrive files will be saved
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    //makes sure each file we upload has a different name. uidSafe creates a random 24-character name
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        }); //this adds the original filepath and extention to the 24-character-random-name
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152, //limits uploaded filesize to be 2mb max
    },
});
//////////////////////// DON'T TOUCH above - IMAGE UPLOAD BIOLDERPLATE /////////////////////////////

////------------------------------- MIDDLEWARE ---------------------------------------------- //
app.use((req, res, next) => {
    console.log(
        "//-------------------- NEW REQUEST ------------------------//"
    );
    next();
});
app.use(compression());

////------ socket.io setup for cookies
const cookieSessionMiddleware = cookieSession({
    secret: `the hounds are always hungry`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
////------ socket.io setup cookie above

app.use(express.json());
app.use(express.static("public"));

// csruf security
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

//React-specific code. if-block runs when we're running the application locally
//app.use runs whenever we receive a request for bundle.js and passes on the request to port 8081, which means our second server (bundle-server) takes care of the request, handles it, then sends it back to our html through bundle.js
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    //for heroku
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//--Not really middleware
const cleanTime = (uploadTime) => {
    return (uploadTime = new Intl.DateTimeFormat("en-GB", {
        // weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
        timeZone: "Etc/GMT-2",
    }).format(uploadTime));
};

////------------------------------- ROUTES ----------------------------------------------------------------------------------- //

app.get("/welcome", (req, res) => {
    console.log("We're in /welcome!");

    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/logout", (req, res) => {
    console.log("We're in /logout!");

    req.session = null;
    res.redirect("/");
});

////------------------------------- /user route ---------------------------------------------- //
app.get("/user", async (req, res) => {
    console.log("We're in /user!");

    try {
        const { rows } = await db.getUserInfo(req.session.userId);
        res.json(rows[0]);
    } catch (e) {
        console.log("ERROR in /user getUserInfo: ", e);
    }
});

////------------------------------- /users route (SEARCH/Findpeople) ---------------------------------------------- //
app.get("/most-recent", async (req, res) => {
    console.log("We're in /most-recent!");

    try {
        const { rows } = await db.getRecentRegisters();
        res.json(rows);
    } catch (e) {
        console.log("ERROR in /most-recent: ", e);
    }
});

app.get("/search-users/:search", async (req, res) => {
    console.log("We're in /most-recent!");

    const name = req.params.search;
    try {
        //refactor this so that both queries run simultaneously
        const respFirst = await db.getMatchingUsersFirst(name);
        const respLast = await db.getMatchingUsersLast(name);

        let firsts = respFirst.rows;
        let lasts = respLast.rows;
        let send = [];

        firsts.map((f) => send.push(f));
        lasts.map((l) => send.push(l));

        res.json(send);
    } catch (e) {
        console.log("ERROR in /most-recent: ", e);
    }
});

////------------------------------- /other-user/:id route ---------------------------------------------- //
app.get("/other-user/:id", async (req, res) => {
    console.log(`We're in /other-user/:id!`);

    try {
        const resp = await db.getOtherUserInfo(req.params.id);
        const send = resp.rows[0];

        !send || send.id == req.session.userId
            ? res.json({ nonExistentIdOrOwnProfile: true })
            : res.json(send);
    } catch (e) {
        console.log("ERROR in /other-user/:id: ", e);
    }
});

////------------------------------- /friend-status/ routes ---------------------------------------------- //
app.get("/friend-status/:id", async (req, res) => {
    console.log("We're in GET /friend-status/:id");

    try {
        const { rows } = await db.checkFriendship(
            req.params.id,
            req.session.userId
        );

        !rows[0]
            ? res.json("Make Friend Request")
            : rows[0].accepted == true
            ? res.json("Unfriend")
            : req.session.userId == rows[0].sender_id
            ? res.json("Cancel Friend Request")
            : res.json("Accept Friend Request");
    } catch (e) {
        console.log("ERROR in /friend-status/:id: ", e);
    }
});

app.post("/friend-status/:other_id", (req, res) => {
    console.log("We're in POST /friend-status/:id");

    if (req.body.kind == "Make Friend Request") {
        db.requestFriendship(req.params.other_id, req.session.userId)
            .then(res.json("Cancel Friend Request"))
            .catch((err) => {
                console.log("ERROR in requestFriendship: ", err);
            });
    } else if (req.body.kind == "Accept Friend Request") {
        db.acceptFriendship(req.params.other_id, req.session.userId)
            .then(res.json("Unfriend"))
            .catch((err) => {
                console.log("ERROR in acceptFriendship: ", err);
            });
    } else {
        db.deleteFriendship(req.params.other_id, req.session.userId)
            .then(res.json("Make Friend Request"))
            .catch((err) => {
                console.log("ERROR in deleteFriendship: ", err);
            });
    }
});

////------------------------------- /friends-wannabes route ---------------------------------------------- //

app.get("/friends-wannabes", (req, res) => {
    db.getFriendsAndWannabes(req.session.userId).then(({ rows }) => {
        // console.log("rows: ", rows);
        res.json(rows);
    });
});

////------------------------------- private chat ---------------------------------------------- //
app.get("/private-chat-info", async (req, res) => {
    console.log("We're in /private-chat!");
    const myId = req.session.userId;

    try {
        const friendChatIds = await onlyFriendChatIds(myId);

        //chattersInfo: [otherId, first, last, imgUrl]
        let chattersInfo = [];
        for (let i = 0; i < friendChatIds.length; i++) {
            let chatterInfo = await db.getChatterById(friendChatIds[i]);
            chattersInfo.push(chatterInfo.rows[0]);
        }

        res.json(chattersInfo);
    } catch (e) {
        console.log("ERROR in GET /private-chat-info: ", e);
        res.json(undefined);
    }
});

app.get("/search-friends/:search", async (req, res) => {
    const id = req.session.userId;
    const srch = req.params.search;

    try {
        const respFirst = await db.searchFriendsFirst(id, srch);
        const respLast = await db.searchFriendsLast(id, srch);

        console.log("respFirst: ", respFirst);

        let firsts = respFirst.rows;
        let lasts = respLast.rows;
        let send = [];

        firsts.map((f) => send.push(f));
        lasts.map((l) => send.push(l));

        // //Filtering out Ids of active chats
        // const chatIds = await onlyPrivChatIds(id);
        // for (let i = 0; i < chatIds.length; i++) {
        //     for (let j = 0; j < send.length; j++) {
        //         if (chatIds[i] == send[j].id) {
        //             send.splice(j, 1);
        //         }
        //     }
        // }

        console.log("send: ", send);
        res.json(send);
    } catch (e) {
        console.log("ERROR in search-friends/:search: ", e);
    }
});

const onlyFriendChatIds = async (userId) => {
    //friendChatIds: array of Ids of friends with whom logged_in_user has a private chat history, ordered by most recently chatted with

    const { rows } = await db.getPrivChatIds(userId);
    let chatIds = [];
    for (let i = 0; i < rows.length; i++) {
        if (
            rows[i].receiver_id == userId &&
            !chatIds.includes(rows[i].sender_id)
        ) {
            chatIds.push(rows[i].sender_id);
        } else if (
            rows[i].sender_id == userId &&
            !chatIds.includes(rows[i].receiver_id)
        ) {
            chatIds.push(rows[i].receiver_id);
        }
    }

    const respFriends = await db.getOnlyFriends(userId);
    const friends = respFriends.rows;

    //friendChatIds: Ids of chatters who are your friends
    let friendChatIds = [];
    for (let i = 0; i < chatIds.length; i++) {
        for (let j = 0; j < friends.length; j++) {
            if (
                chatIds[i] == friends[j].receiver_id ||
                chatIds[i] == friends[j].sender_id
            ) {
                friendChatIds.push(chatIds[i]);
            }
        }
    }

    return friendChatIds;
};

////------------------------------- /register route ---------------------------------------------- //

app.post("/register", async (req, res) => {
    console.log("We're in /register!");
    const { first, last, email, password } = req.body;

    if (password == "" || !password) {
        return res.json({ success: false });
    } else {
        try {
            const hashedP = await hash(password);
            const resp = await db.submitRegistration(
                first,
                last,
                email,
                hashedP
            );
            const id = resp.rows[0].id;

            req.session.userId = id;
            res.json({ success: true });
        } catch (e) {
            console.log("ERROR in /register: ", e);
            res.json({ success: false });
        }
    }
});

////------------------------------- /login route ---------------------------------------------- //
app.post("/login", async (req, res) => {
    console.log("We're in /login!");

    try {
        const { rows } = await db.login(req.body.email);
        const matchValue = await compare(req.body.password, rows[0].password);
        // console.log("matchValue: ", matchValue);

        if (req.body.password == "") {
            throw Error;
        }

        if (matchValue) {
            req.session.userId = rows[0].id;
        } else {
            throw Error;
        }

        res.json({ success: true });
    } catch (e) {
        console.log("ERROR in POST /login: ", e);
        res.json({ success: false });
    }
});

////------------------------------- /reset password routes ---------------------------------------------- //
app.post("/reset-pword/one", async (req, res) => {
    const { email } = req.body;
    try {
        const { rows } = await db.checkUser(email);
        if (rows.length == 0) {
            throw Error;
        }

        const resp = rows[0];

        const newCode = c({ length: 6 });
        const emailBody = `Dear ${resp.first} ${resp.last},

Here is your password-reset code.

Code: ${newCode}

This code expires after 20 minutes.
Enter the code into the password-reset form along with your new password of choice.

Yours,
amJam`;

        await sendEmail(email, "Reset-code for amJam", emailBody);
        await db.saveCode(email, newCode);
        res.json({ success: true });
    } catch (e) {
        console.log("ERROR in /reset-pword/one: ", e);
        res.json({ success: false });
    }
});

app.post("/reset-pword/two", async (req, res) => {
    const { newPassword, code, email } = req.body;

    try {
        const { rows } = await db.getCode();

        if (code == "" || rows.length == 0 || newPassword == 0) {
            throw Error;
        }

        if (code == rows[0].code) {
            const hashedP = await hash(newPassword);
            await db.updatePassword(email, hashedP);
            res.json({ success: true });
        } else {
            throw Error;
        }
    } catch (e) {
        console.log("ERROR in /reset-pword/two: ", e);
        res.json({ success: false });
    }
});

////------------------------------- /upload-image route ---------------------------------------------- //
//uploader.single('propertyKey from formData') runs the multer code from the boilerplate above
app.post("/upload-profile", uploader.single("file"), s3.upload, (req, res) => {
    const { user_id } = req.body;

    if (req.file) {
        db.updateImgUrl(
            //this url is copied from aws page of image (without the id-characters at the end)
            "https://martinpaul-msg-socialnetwork.s3.eu-central-1.amazonaws.com/" +
                req.file.filename,
            user_id
        )
            .then(({ rows }) => {
                const resp = rows[0];
                res.json({
                    resp,
                });
            })
            .catch((err) => {
                console.log("ERROR in updateImgUrl: ", err);
                res.json({
                    success: false,
                });
            });
    } else {
        res.json({
            success: false,
        });
    }
});

////------------------------------- /update-bio route ---------------------------------------------- //
app.post("/update-bio", async (req, res) => {
    console.log("We're in /update-bio");

    const { newBio, id } = req.body;
    try {
        await db.updateBio(newBio, id);
        res.json({ success: true });
    } catch (e) {
        console.log("ERROR in /update-bio: ", e);
        res.json({ success: false });
    }
});

////------------------------------- * route ---------------------------------------------- //

app.get("*", function (req, res) {
    console.log("We're in * !");

    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

////-------------------------------  Port ---------------------------------------------- //

// app.listen(8080, function () {
//     console.log("socialnetwork server listening...");
// });

////---------- socket.io setup
server.listen(8080, function () {
    console.log("socialnetwork server listening...");
});

////------------------------------- socket code ---------------------------------------------- //
//the code in io.on('connection') runs upon connecting
io.on("connection", function (socket) {
    //all the socket code we run has to be within this 'connection' event (?? i think that's what andrea meant)
    console.log(`socket with id ${socket.id} is now connected`);

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    socket.on("get10LastPublicMessages", () => {
        db.getLastTenMessages().then(({ rows }) => {
            for (let i = 0; i < rows.length; i++) {
                rows[i].created_at = cleanTime(rows[i].created_at);
            }

            io.sockets.emit("last10Msgs", rows.reverse());
        });
    });

    socket.on("Entered newChatMsg", async (newMsg) => {
        // console.log("from chat.js: ", newMsg);

        await db.insertNewMessage(newMsg, userId);
        const { rows } = await db.mostRecentMessage();
        rows[0].created_at = cleanTime(rows[0].created_at);

        io.sockets.emit("newChatMsg", rows);
    });

    //// -------------------------- private Chat -------------------------- //
    socket.on("openedPrivateChat", () => {
        // console.log("userId in openedPrivateChat: ", userId);
        socket.emit("store_myId", userId);
        socket.join(`private-chat room`);
    });

    socket.on("get private msgs", async (chatterId) => {
        // console.log("chatterId in get private msgs: ", chatterId);

        const { rows } = await db.getPrivateChatMsgs(userId, chatterId);

        // console.log("rows from getPrivateChatMsgs: ", rows);

        for (let i = 0; i < rows.length; i++) {
            rows[i].created_at = cleanTime(rows[i].created_at);
        }

        //Connecting to private chat room
        let chatters = [chatterId, userId];
        chatters.sort((a, b) => a - b);

        socket.join(`room for ${chatters[0]} and ${chatters[1]}`);

        socket.request.session.privUserOne = chatters[0];
        socket.request.session.privUserTwo = chatters[1];
        io.to(socket.id).emit("lastPrivMsgs", rows.reverse());
    });

    socket.on("EnteredNewPrivMsg", async (msgOthrId) => {
        // console.log("msgOthrId in EnteringNewPrivMsg: ", msgOthrId);

        await db.insertNewPrivateMessage(msgOthrId[0], msgOthrId[1], userId);

        const { rows } = await db.mostRecentPrivMessage(userId, msgOthrId[1]);
        // console.log("rows from mostRecentPrivMessage: ", rows);
        rows[0].created_at = cleanTime(rows[0].created_at);

        //Emitting to private chat room
        const idOne = socket.request.session.privUserOne;
        const idTwo = socket.request.session.privUserTwo;
        io.to(`room for ${idOne} and ${idTwo}`).emit("newPrivMsg", rows);

        console.log("userId in EnteredNewPrivMsg: ", userId);
        io.to(`private-chat room`).emit("newPrivMsgAlert", userId);
    });

    io.on("disconnect", function () {
        //Disconnecting from private chat room
        const idOne = socket.request.session.privUserOne;
        const idTwo = socket.request.session.privUserTwo;
        socket.leave(`room for ${idOne} and ${idTwo}`);
    });
});
