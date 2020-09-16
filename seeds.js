var mongoose   = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");

var data = [
    {
        name  : "Manali Hills",
        image : "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e507440772e79d69f4fc3_340.jpg",
        description : "Beauty of Snow and Himachal Pardesh"
    },
    {
        name  : "Kerala",
        image : "https://pixabay.com/get/54e5dc474355a914f1dc84609620367d1c3ed9e04e507440772e79d69f4fc3_340.jpg",
        description : "God's own place"
    },
    {
        name  : "Kashmir",
        image : "https://pixabay.com/get/57e1dd4a4350a514f1dc84609620367d1c3ed9e04e507440772e79d69f4fc3_340.jpg",
        description : "Kashmir is the Uppermost part of India"
    }
];

function seedDB(){
    
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Removed Campgrounds!");
        }

        for(var i=0; i<data.length; i++){
    
            Campground.create(data[i], function(err, campground){
                   
                if(err){
                    console.log(err);
                }else{
                    console.log("Added a New Campground");

                    Comment.create(
                        {
                            text: "I just Love this place",
                            author: "Homie"
                        }, function(err,comment){
                            
                            if(err){
                                console.log(err);
                            }
                            else
                            {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Addded a New Comment");
                            }
                        });
                }
                 
              });
        
        }
        

    });
    
    
    
}

module.exports = seedDB;