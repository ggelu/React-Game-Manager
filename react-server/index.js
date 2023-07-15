const express = require("express");
const session = require("express-session");
const cors = require("cors");
const SteamStrategy = require("passport-steam").Strategy
const passport = require("passport");
const authRoute = require("./routes/auth");

passport.use(new SteamStrategy({
    returnURL: "http://localhost:5000/auth/steam/return",
    realm: "http://localhost:5000/",
    apiKey: "35FE52E19D7EF36461E3E9DFB3D8B931"
    },
    function(identifier, profile, done){
        process.nextTick(function () {
            profile.identifier = identifier;
            return done(null, profile);
        })
    }
))

var app = express();

app.use(session(
    {
        secret: 'cheieextraordinardesecreta',
        resave: false,
        saveUninitialized: true
    }
))

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: ["http://localhost:3000", "http://auth.gog.com"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}))

app.use("/auth", authRoute)

app.listen("5000", () => {
    console.log("Server is running");
})

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });