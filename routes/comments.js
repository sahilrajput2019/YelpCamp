
//Accesing packages used in this file

var express      =  require("express");
var router       =  express.Router();
var Campground   =  require("../models/campgrounds");
var Comment      =  require("../models/comment");
var middleware   = require("../middleware");

//Form to create a new Campground
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){

    Campground.findById(req.params.id,function (err,campground){

        if(err){
            req.flash("error","Something Went Wrong");
            console.log(err);
        }else{

            res.render("comments/new",{campground:campground});
        }
      });
});

//Post a new Comment 
//Also checking if user is logged in
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
       
    //Adding to that particular Campground
    Campground.findById(req.params.id,function(err,campground){
         if(err){
             console.log(err);
             res.redirect("/campgrounds");
               
         }else{
            //Adding to the database
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
               
                }else{
                    //Adding id and username to comment
                    comment.author.id       = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
         }
    });
});

//Edit Routes

//Form for Edit
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){

    Comment.findById(req.params.comment_id, function(err,foundComment){

        if(err){
            res.redirect("/back");
        }else{
            res.render("comments/edit",{campground_id : req.params.id, comment:foundComment});
        }
    });

});

//Comment Update
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req,res){

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){

        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Comment Delete Route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){

    Comment.findByIdAndRemove(req.params.comment_id,function(err){

        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
        
    });
});


//Exporting object
module.exports = router;