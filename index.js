const express = require("express");
const app = express();
const db = require("./db");
const { hash, compare } = require("./bc");
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const c = require("crypto-random-string");
const { sendEmail } = require("./ses");

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

//React-specific code. if-block runs when we're running the application locally
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
    //if user is logged in (i.e. has userId cookie), send to home, else send to sign/registration page
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

////------------------------------- /register route ---------------------------------------------- //
app.post("/register", (req, res) => {
    console.log("req.body: ", req.body);
    const bod = req.body;

    //if bod.password is undefined, then 'hashedP' should be undefined
    const hashP = new Promise(function (resolve) {
        if (bod.password) {
            hash(bod.password).then((actualHashedP) => {
                resolve(actualHashedP);
            });
        } else {
            resolve(bod.password);
        }
    });

    hashP.then((hashedP) => {
        db.submitRegistration(bod.first, bod.last, bod.email, hashedP)
            .then(({ rows }) => {
                console.log("Register Successful");
                console.log("rows: ", rows);
                //resetCookies
                // const { csrfSecret } = req.session;
                // req.session = {};
                // req.session.csrfSecret = csrfSecret;

                //userId and login Cookie
                req.session.userId = rows[0].id;
                // req.session.loggedIn = true;
            })
            .then(() => {
                // console.log("Cookies leaving /register: ", req.session);
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("ERROR in POST /register, submitReg", err);
                res.json({ success: false });
            });
    });

    //set a cookie (i.e. req.session.userId = db query response id)
    //send back res.json({success: true})
});

////------------------------------- /login route ---------------------------------------------- //
app.post("/login", (req, res) => {
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

////------------------------------- /reset routes ---------------------------------------------- //
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

            console.log("rows[0].code: ", rows[0].code);
            console.log("req.body: ", req.body);

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

app.listen(8080, function () {
    console.log("social media server listening...");
});
