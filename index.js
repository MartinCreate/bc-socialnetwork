//AWS Bucketname: martinpaul-msg-socialnetwork
/* To check the images on aws, go to
https://s3.console.aws.amazon.com/s3/buckets/martinpaul-msg-socialnetwork/
*/

const express = require("express");
const app = express();
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
        "//----------------------------- NEW REQUEST --------------------------------------------------//"
    );
    next();
});
app.use(compression());
app.use(
    cookieSession({
        secret: "the hounds are always hungry",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(express.json());
app.use(express.static("public"));

// csruf security
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

//React-specific code. if-block runs when We're running the application locally
//app.use runs whenever we receive a request for bundle.js and passes on the request to port 8081, which means our second server (bundle-server) takes care of the quest, handles it, then sends it back to our html through bundle.js
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    //this code runs if we run the application on heroku
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

////------------------------------- ROUTES ---------------------------------------------- //

app.get("/welcome", (req, res) => {
    console.log("We're in /welcome!");

    //if user is logged in (i.e. has userId cookie), send to home, else send to sign/registration page
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
app.get("/user", (req, res) => {
    console.log("We're in /user!");
    console.log("req.session.userId: ", req.session.userId);

    db.getUserInfo(req.session.userId)
        .then(({ rows }) => {
            console.log("We're in /user! getUserInfo");

            console.log("rows: ", rows);
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log("ERROR in /user getUserInfo: ", err);
        });
});

////------------------------------- * route ---------------------------------------------- //

app.get("*", function (req, res) {
    console.log("We're in * !");
    console.log("req.session.userId: ", req.session.userId);

    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

////------------------------------- /register route ---------------------------------------------- //
// app.post("/register", (req, res) => {
//     console.log("We're in /register!");

//     const bod = req.body;

//     //if bod.password is undefined, then 'hashedP' should be undefined
//     const hashP = new Promise(function (resolve) {
//         if (bod.password) {
//             hash(bod.password).then((actualHashedP) => {
//                 resolve(actualHashedP);
//             });
//         } else {
//             resolve(bod.password);
//         }
//     });

//     hashP.then((hashedP) => {
//         db.submitRegistration(bod.first, bod.last, bod.email, hashedP)
//             .then(({ rows }) => {
//                 console.log("Register Successful");
//                 req.session.userId = rows[0].id;
//             })
//             .then(() => {
//                 // console.log("Cookies leaving /register: ", req.session);
//                 res.json({ success: true });
//             })
//             .catch((err) => {
//                 console.log("ERROR in POST /register, submitReg", err);
//                 res.json({ success: false });
//             });
//     });
// });

////rewriting app.post('/register',...) with async & await
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
app.post("/login", (req, res) => {
    console.log("We're in /login!");

    db.login(req.body.email)
        .then(({ rows }) => {
            compare(req.body.password, rows[0].password)
                .then((matchValue) => {
                    console.log("matchValue: ", matchValue);

                    if (req.body.password == "") {
                        throw Error;
                    }

                    if (matchValue) {
                        req.session.userId = rows[0].id;
                        return;
                    } else {
                        throw Error;
                    }
                })
                .then(() => {
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("ERROR in POST /login: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("ERROR in POST /login: ", err);
            res.json({ success: false });
        });
});

////------------------------------- /reset password routes ---------------------------------------------- //
app.post("/reset-pword/one", (req, res) => {
    db.checkUser(req.body.email)
        .then(({ rows }) => {
            if (rows.length == 0) {
                throw Error;
            }

            console.log("req.body: ", req.body);
            rows = rows[0];

            const newCode = c({ length: 6 });
            const emailBody = `Dear ${rows.first} ${rows.last},

Here is your password-reset code.

Code: ${newCode}

This code expires after 20 minutes.
Enter the code into the password-reset form along with you new password of choice.

Love you,
amJam`;

            sendEmail(req.body.email, "Reset-code for amJam", emailBody)
                .then(() => {
                    return db.saveCode(req.body.email, newCode);
                })
                .then(() => {
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("ERROR in /reset... sendEmail/saveCode: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("ERROR in /reset... : ", err);
            res.json({ success: false });
        });
});

app.post("/reset-pword/two", (req, res) => {
    const bod = req.body;

    db.getCode()
        .then(({ rows }) => {
            if (bod.code == "" || rows.length == 0 || bod.newPassword == 0) {
                throw Error;
            }

            if (bod.code == rows[0].code) {
                hash(bod.newPassword).then((hashedP) => {
                    db.updatePassword(bod.email, hashedP)
                        .then(() => {
                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log(
                                "ERROR in /reset.../two updatePassword: ",
                                err
                            );
                            res.json({ success: false });
                        });
                });
            } else {
                throw Error;
            }
        })
        .catch((err) => {
            console.log("ERROR in /reset../two getCode: ", err);
            res.json({ success: false });
        });
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
    console.log("req.body: ", req.body);
    console.log("newBio: ", newBio);
    try {
        const resp = await db.updateBio(newBio, id);
        console.log("resp in /update-bio: ", resp);
        // const biores = resp.rows[0].bio;
        res.json({ success: true });
    } catch (e) {
        console.log("ERROR in /update-bio: ", e);
        res.json({ success: false });
    }
});

////-------------------------------  Port ---------------------------------------------- //

app.listen(8080, function () {
    console.log("social media server listening...");
});
