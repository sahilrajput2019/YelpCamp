
//Importing Pacakges 
var express         =  require("express"),
    app             =  express();
    bodyParser      =  require("body-parser"),
    passport        =  require("passport"),
    LocalStrategy   =  require("passport-local")
    mongoose        =  require("mongoose"),
    methodOverride  = require("method-override"),
    Campground      =  require("./models/campgrounds"),
    User            =  require("./models/user"),
    Comment         =  require("./models/comment"),
    flash           =  require("connect-flash"), 
    seedDB          =  require("./seeds.js");

//Accessing Routes Files
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");



app.use(require("express-session")({

    secret: "I am best in my opinion",
    resave:false,
    saveUninitialized:false
}));


//Required functions to be intialized to use Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error       = req.flash("error");
   res.locals.success     = req.flash("success");

   next();
});

//Don't need to mention the extension ejs everytime refering a file
app.set("view engine","ejs");

//Use of Body Parser for reading data from form
app.use(bodyParser.urlencoded({extended:true}));

//Providing access to public directory
app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));


//Connecting to Localhost Server Database named as (yelp_camp)
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser:true ,useUnifiedTopology: true });

mongoose.set('useFindAndModify', false);


/*Databse Embeeding of campgrounds and Comments 
using Object Refrencing in this File */

//seedDB();

//Enabling to use these files
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);



//Localhost Port number mentioned 3000
app.listen(3000,function() {
	console.log("YelpCamp Server is started now.");
});