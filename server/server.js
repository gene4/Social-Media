/////////////////////////////////
/// IMPORTS/////////////// /////
///////////////////////////////

const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("../db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("../bcrypt");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");

///////////////////////////
//////// MIDDLEWARE //////
/////////////////////////
const secret =
    process.env.COOKIE_SECRET || require("../secrets.json").COOKIE_SECRET;

app.use(
    cookieSession({
        secret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: "strict",
    })
);

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.json());
app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

///////////////////////
////////ROUTES////////
/////////////////////

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.post("/register", (req, res) => {
    // console.log("req.body", req.body);
    hash(req.body.password)
        .then((hashedPw) => {
            console.log("hashedPwd in /register", hashedPw);
            db.addUser(
                req.body.firstName,
                req.body.lastName,
                req.body.email,
                hashedPw
            )
                .then((result) => {
                    console.log(result);
                    req.session.userId = result.rows[0].id;
                    req.session.name = result.rows[0].first;
                    console.log(req.session);
                    res.json(result.rows);
                })
                .catch((e) => {
                    console.log(e);
                    res.json({ success: false });
                });
        })
        .catch((err) => console.log("err in hash:", err));
});

app.post("/login", (req, res) => {
    db.getUser(req.body.email)
        .then((result) => {
            if (!req.body.email) {
                console.log("cant find email");
                res.json({ success: false });
            } else {
                let hashFromDb = result.rows[0].password;
                compare(req.body.password, hashFromDb)
                    .then((match) => {
                        if (match) {
                            req.session.name = result.rows[0].first;
                            req.session.userId = result.rows[0].id;
                            console.log("match password", req.session);
                            res.json({ success: true });
                        } else {
                            console.log("password didnt match");
                            res.json({ success: false });
                        }
                    })
                    .catch((e) => {
                        console.log("cant find password", e);
                        res.json({ success: false });
                    });
            }
        })
        .catch((e) => {
            console.log("cant find email", e);
            res.json({ success: false });
        });
});

app.post("/password/reset/start", function (req, res) {
    db.getUser(req.body.email)
        .then((user) => {
            if (!req.body.email) {
                console.log("cant find email");
                res.json({ success: false });
            } else {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                db.addCode(secretCode, user.rows[0].email)
                    .then((result) => {
                        let emailBody = `Hey ${user.rows[0].first}! , here is your code to reset the password: ${result.rows[0].code} | It will expire in 10 minutes!`;
                        ses.sendEmail(result.rows[0].email, emailBody)
                            .then((result) => {
                                console.log("Email was sent!");
                                res.json({ success: true });
                            })
                            .catch((e) => {
                                console.log("Failed to send email", e);
                                res.json({ success: false });
                            });
                    })
                    .catch((e) => {
                        console.log("Failed to add code", e);
                        res.json({ success: false });
                    });
            }
        })
        .catch((e) => {
            console.log("cant find email", e);
            res.json({ success: false });
        });
});

app.post("/password/reset/verify", function (req, res) {
    console.log(req.body.email);
    db.getCode(req.body.email)
        .then((result) => {
            console.log(result);
            if (result.rows[0].code === req.body.code) {
                hash(req.body.password)
                    .then((hashedPw) => {
                        console.log(
                            "hashedPwd in /password/reset/verify",
                            hashedPw
                        );
                        db.updatePassword(hashedPw, req.body.email)
                            .then((result) => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log("err in updating password:", err);
                                res.json({ success: false });
                            });
                    })
                    .catch((err) => {
                        console.log("err in hash:", err);
                        res.json({ success: false });
                    });
            }
        })
        .catch((e) => {
            console.log("cant get code", e);
            res.json({ success: false });
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
