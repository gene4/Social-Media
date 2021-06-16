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
const s3 = require("../s3");

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

////////MULTER stuff/////

const multer = require("multer");
const uidSafe = require("uid-safe");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

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

app.get("/user", function (req, res) {
    db.getUserById(req.session.userId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((e) => {
            console.log("cant find user", e);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, function (req, res) {
    if (req.file) {
        let fullUrl = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;
        db.updateProfilePic(fullUrl, req.session.userId)
            .then((result) => {
                res.json(result.rows[0]);
            })
            .catch((e) => {
                console.log("error in updating url", e);
            });
    }
});

app.post("/bio", function (req, res) {
    db.updateBio(req.body.bio, req.session.userId)
        .then((result) => {
            console.log("bio was sent", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((e) => {
            console.log("error in updating bio", e);
            res.json({ success: false });
        });
});

app.get("/user/:id.json", function (req, res) {
    db.getUserById(req.params.id)
        .then((result) => {
            if (req.params.id == req.session.userId) {
                res.json({ ownProfile: true });
            } else {
                res.json(result.rows);
            }
        })
        .catch((e) => {
            console.log("cant find user", e);
        });
});

app.get("/users/last", function (req, res) {
    db.getLastUsers()
        .then((result) => {
            console.log("Last users were sent", result.rows);
            res.json(result.rows);
        })
        .catch((e) => {
            console.log("error in last users", e);
        });
});

app.get("/users/search/:input", function (req, res) {
    db.getUserSearch(req.params.input)
        .then((result) => {
            console.log("searched users were sent", result.rows);
            res.json(result.rows);
        })
        .catch((e) => {
            console.log("error in searched users", e);
        });
});

app.get("/friendship-status/:id", function (req, res) {
    db.getFriendship(req.session.userId, req.params.id)
        .then((result) => {
            console.log("friendship table", result.rows);
            if (!result.rows[0]) {
                res.json({ friendship: false });
            } else {
                res.json(result.rows);
            }
        })
        .catch((e) => {
            console.log("error in get friendship", e);
        });
});

app.post("/make-request/:id", function (req, res) {
    db.requestFriendship(req.session.userId, req.params.id)
        .then((result) => {
            console.log("friend request sent - result.rows", result.rows);
        })
        .catch((e) => {
            console.log("error in friends request", e);
        });
});

app.post("/cancel-request/:id", function (req, res) {
    db.cancelFriendship(req.session.userId, req.params.id)
        .then((result) => {
            console.log("cancel friend request - result.rows", result.rows);
            res.json({ success: true });
        })
        .catch((e) => {
            console.log("error in cancel friends request", e);
            res.json({ success: false });
        });
});

app.post("/accept-request/:id", function (req, res) {
    db.acceptFriendRequest(req.session.userId, req.params.id)
        .then((result) => {
            console.log("friend request accepted ");
            res.json({ success: true });
        })
        .catch((e) => {
            console.log("error in accept friend request", e);
            res.json({ success: false });
        });
});

app.get("/friends.json", function (req, res) {
    db.getFriendsList(req.session.userId)

        .then((result) => {
            console.log("friends list", result.rows);
            res.json(result.rows);
        })
        .catch((e) => {
            console.log("error in getting friends list", e);
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
