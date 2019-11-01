var express = require("express");

var morgan = require("morgan");

var mongoose = require("mongoose");

let exphbs = require("express-handlebars");

var axios = require("axios");

var cheerio = require("cheerio");

var db = require("./models");

var PORT = 8080;

var app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });