
//Accessing Packges used in this Particular File

var express      = require("express");
var router       = express.Router();
var Campground   = require("../models/campgrounds");
var middleware   = require("../middleware");


router.get("/campgrounds",function(req,res){

    //Function to find all campgrounds in the database
    Campground.find({},function (err,allCampgrounds) {
       if(err){
           console.log(err);
       }else{
       
           res.render("campgrounds/index",{campground : allCampgrounds});
       } 
    });
});

//Form for creation of New Campground
router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
   
   res.render("campgrounds/new");
});

//Show that particular Campground on new Page based on ID
router.get("/campgrounds/:id",function(req,res){
   
   Campground.findById(req.params.id).populate("comments").exec( function (err,foundCampground){
              
       if(err){
           console.log(err);
       }
       else{
           res.render("campgrounds/show",{campground:foundCampground});
       }
      });
       
});

//Creating a new campground
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
   
   var name  = req.body.name;
   var image = req.body.image;
   var desc  = req.body.description;
   var price = req.body.price;
   
   var author = {
       id       : req.user._id,
       username : req.user.username
   }
   //Creating a campground object 
   var newCampground = {name:name, image:image, description:desc, price: price, author:author};
   
   //Adding campground to the database
   Campground.create(newCampground , function(err,newlyCreated){
       
       if(err){
           console.log(err);
       }else{
          res.redirect("/campgrounds");
       }    
   });
   
});

//EDIT ROUTES

//Edit campground Form
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    
         Campground.findById(req.params.id, function(err,foundCampground){

            res.render("campgrounds/edit",{campground:foundCampground});
         });
});

//UPDATE ROUTES
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updaatedCampground){ 
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Delete Route

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){

    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
      });
});


//Exporting the Object
module.exports = router;
