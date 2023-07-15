const router = require("express").Router();
const passport = require("passport")
const axios = require('axios')

const clientURL = "http://localhost:3000/";

router.get("/steam", 
    passport.authenticate('steam', {failureRedirect: clientURL}),
    function(req, res) {
        res.redirect(clientURL);
    });

router.get("/steam/success", (req, res) => {
    if(req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user
        })
    }
}); 

router.get("/steam/return", 
    function (req, res, next) {
        req.url = req.originalUrl;
        next();
    },
    passport.authenticate('steam', {failureRedirect: clientURL}),
    function (req, res) {
        res.redirect(clientURL);
    });

router.get("/steam/logout", (req, res) => {
    req.session.destroy()
}); 

router.get("/gog", (req, res) => {
        res.redirect("http://auth.gog.com/auth?client_id=46899977096215655&redirect_uri=https%3A%2F%2Fembed.gog.com%2Fon_login_success%3Forigin%3Dclient&response_type=code&layout=client2")
    });
    

module.exports = router;