const express = require("express");
const app = express();
const db = require("./db");
const { hash, compare } = require("./bc");
const compression = require("compression");
const cookieSession = require("cookie-session");

app.use(compression());
app.use(
    cookieSession({
        secret: "the hounds are always hungry",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(express.json());
app.use(express.static("public"));

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

app.get("/welcome", (req, res) => {
    //if user is logged in (i.e. has userId cookie), send to home, else send to sign/registration page
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

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
                console.log("Cookies leaving /register: ", req.session);
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

app.listen(8080, function () {
    console.log("social media server listening...");
});
