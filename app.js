//bring in express 
const express = require("express"); 
const mongoose = require("mongoose"); 
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require( 'body-parser' );
const passport = require('passport');
var exphbs = require("express-handlebars"); 

const app = express();

require('./config/passport')(passport); 
//passport needs to be defined in this file 

const hbs = require("express-handlebars");

//setting up dB
//const dataBase = require("./dB/connection").MongoURI;

const dataBase = "mongodb+srv://truffi01:ruffino1@golfcluster-lqtng.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(dataBase, { useNewUrlParser: true, useUnifiedTopology: true, }) 
  .then(() => console.log("Mongo Connected"))
  .catch(err => console.log(err)); 
app.use(express.urlencoded({ extended: false }));
// Express Session 
app.use(session({
  secret: 'golf',
  resave: true,
  saveUninitialized: true,
}));


app.use( bodyParser.urlencoded({ extended: true }) );
//need to put authenticate after express session middleware and between the flash 
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware 
app.use(flash());

//global variables
app.use((req, res, next) => {
  res.locals.succes_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next(); 
}); 




// set a port in case we deploy or use a local host. A port is a communication endpoint 
app.set("port", process.env.PORT || 3000);

app.engine(
  ".hbs",
  hbs({
    extname: "hbs",
    partialsDir: "views/",
    layoutsDir: "views/",
    defaultLayout: "layout"
  })
);
app.set("view engine", "hbs");


//user page is all of the controllers. Each get route is /Login, /Register. it will be users/login or users/register. If you go to users/login you get login page. If you go to users/
app.use(express.static("public"));
app.use("/", require("./controllers/index"));
app.use("/users", require("./controllers/users"));
app.use("/scores", require("./controllers/scores.js"));

//run a server 
app.listen(app.get("port"), () => {
    console.log("Golf Scorecard is running successfully");
  });