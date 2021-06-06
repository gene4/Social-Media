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

///////////////////////////
//////// MIDDLEWARE //////
/////////////////////////
const secret =
    process.env.COOKIE_SECRET || require("../secret.json").COOKIE_SECRET;

app.use(
    cookieSession({
        secret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: "strict",
    })
);

app.use(express.json());
app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

///////////////////////
////////ROUTES////////
/////////////////////

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
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
                    req.session.id = result.rows[0].id;
                    req.session.name = result.rows[0].first;
                    console.log(req.session);
                    res.json(result.rows);
                    res.redirect("/");
                })
                .catch((e) => {
                    console.log(e);
                    res.json({ success: false });
                });
        })
        .catch((err) => console.log("err in hash:", err));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
