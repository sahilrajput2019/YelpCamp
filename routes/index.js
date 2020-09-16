
//Accessing pacakges used in this file
var express   =  require("express");
var router    =  express.Router();
var passport  =  require("passport");
var User      =  require("../models/user");


//Homepage req = request , res = response 
router.get("/",function(req,res){
    res.render("landingPage");
});

//Authentication Routes

//SignUp Form
router.get("/register",function(req,res){

    res.render("register");
});

//Adding user to database
router.post("/register",function(req,res){

    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
             if(err){
                 req.flash("error",err.message);
                 return res.render("register");
             }
             passport.authenticate("local")(req,res,function(){
                req.flash("success", "Welcome to YelpCamp " +  user.username);
                res.redirect("/campgrounds");
             });
    });
});

//Login form
router.get("/login",function(req,res){

    res.render("login");
});

//Checking authentication
router.post("/login", passport.authenticate("local",{
   
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
    
}),function(req,res){

});


//Logout ROute
router.get("/logout",function(req,res){

    req.logOut();
    req.flash("success","Logged Out, Successfully");
    res.redirect("/");
});

//Exporting object
module.exports = router;