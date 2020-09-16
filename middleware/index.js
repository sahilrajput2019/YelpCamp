//All the middleware goes here

var Campground = require("../models/campgrounds");
var Comment    = require("../models/comment");


middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){

    //is user logged in
    if(req.isAuthenticated()){

        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                
                req.flash("error","Campground not found");
                res.redirect("back");
                
            }else{
                //does user own that campground
                if(foundCampground.author.id.equals(req.user.id)){
                
                    next();
                
                }else{
                    
                    req.flash("error","Access Denied");
                    res.redirect("back");
                }
            }
        });
    }else{
          res.redirect("back");
    }

}



middlewareObj.checkCommentOwnership = function(req,res,next){

    //is user logged in
    if(req.isAuthenticated()){

        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
            
                res.redirect("back");
                
            }else{
                //does user own that campground
                if(foundComment.author.id.equals(req.user.id)){
                
                    next();
                
                }else{
                    req.flash("error","Access Denied");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","Login Required");
          res.redirect("back");
    }

}

middlewareObj.isLoggedIn =  function(req,res,next){

    if(req.isAuthenticated()){
        return next();
    }
    /* We always perform this line before we redirect because 
     flash always works on next Page error is a key or id here, can be anything*/
    req.flash("error","Login Required");
    res.redirect("/login");
}



module.exports = middlewareObj;