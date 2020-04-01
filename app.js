//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
//Vamos a decir que solo queremos que sea el password lo que encripte

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  //Creamos el nuevo usuario que va a venir de neustra página de registro
  //con el Schema
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  // Lo salvamos en nuestro servidor
  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
    res.render("secrets");
    }
  });

});

app.post("/login", function(req, res){
  //Creamos dos variables con los datos que vamos a necesitar para hacer login
  const username = req.body.username;
  const password = req.body.password;

// Tendremos que checkear que están en nuestra base de datos
User.findOne({email: username}, function(err, foundUser){
  if (err) {
    console.log(err);
  } else {
    if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      }
    }
  }
});

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
