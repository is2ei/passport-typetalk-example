const TypetalkStrategy = require("passport-typetalk").Strategy,
    config = require("./config"),
    express = require("express"),
    passport = require("passport");

var app = express(),
    port = 3000;

passport.use(new TypetalkStrategy({
    "callbackURL": "http://localhost:3000/auth/typetalk/callback",
    "clientID": config.clientID,
    "clientSecret": config.clientSecret,
    "scope": [
        "my",
        "topic.read"
    ]
}, (accessToken, refreshToken, profile, cb) => cb(null, profile)));

passport.serializeUser(function serializeUser (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function deserializeUser (obj, cb) {
    cb(null, obj);
});

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({"extended": true}));
app.use(require("express-session")({
    "resave": true,
    "saveUninitialized": true,
    "secret": "keyboard cat"
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send('<a href="/auth/typetalk">Login with Typetalk</a>');
});

app.get("/profile", (req, res) => {
    res.send(`<p>ID: ${req.user.id}</p><p>Name: ${req.user.name}</p>`);
});

app.get(
    "/auth/typetalk",
    passport.authenticate("typetalk")
);

app.get(
    "/auth/typetalk/callback",
    passport.authenticate("typetalk", {"failureRedirect": "/"}),
    (req, res) => {
        res.redirect("/profile");
    }
);

app.listen(port);
