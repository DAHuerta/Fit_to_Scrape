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

app.get("/", function(req, res) {

  Article.find({}, null, { sort: { created: -1} }, function(err, data) {
    if(data.length === 0) {
      res.render("placeholder", { message: "There's nothing scraped yet!" });
    } else {
      res.render("index", { articles: data });
    }
  })

})

app.get("/scrape", function(req, res) {

  axios.get("https://www.theonion.com").then(function(response) {
    var $ = cheerio.load(response.data);
    var results = [];
    $("h1.sc-759qgu-0").each(function(i, element) {
      var title = $(element).text();
      var link = $(element).parent("a").attr("href");
      var image = $(element).find(".sc-1xh12qx-2");

      results.push({
        title: title,
        link: link,
        image: image
      });

      var entry = new Article(result);
      Article.find({ title: title }, function(err, data) {
        if (data.length === 0) {
          entry.save(function(err, data) {
            if (err) throw err
          });
        };
      });

    });
    console.log("Scrape finished.");
    screen.direct("/");
  });

});

app.get("/saved", function(req, res) {

  Article.find({ isSaved: true }, null, { sort: { created: -1 } }, function(err, data) {
    if(data.length === 0) {
      res.render("placeholder", { message: "You have no articles saved!"});
    } else {
      res.render("saved", { saved: data });
    }
  });

});

app.get("/:id", function(req, res) {

  Article.findById(req.params.id, function(err, data) {
    res.json(data);
  })

})

app.post("/search", function(req, res) {

  Article.find({ $text: { $search: req.body.search, $caseSensitive: false } }, null, { sort: { created: -1 } }, function(err, data) {
    if (data.length === 0) {
      res.render("placeholder", { message: "Nothing has been found" });
    } else {
      res.render("search", { search: data });
    }
  });

});

app.post("/save/:id", function(req, res) {

  Article.findById(req.params.id, function(err, data) {
    if(data.isSaved) {
      Article.findByIdAndUpdate(req.params.id, { $set: { isSaved: false, status: "Save Article" } }, { new: true }, function(err, data) {
        res.redirect("/");
      })
    } else {
      Article.findByIdAndUpdate(req.params.id, { $set: { isSaved: true, status: "Saved" } }, { new: true }, function(err, data) {
        res.redirect("/saved");
      })
    }
  })

})

app.post("/note:id", function(req, res) {

  var note = new Note (req.body);
  note.save(function(err, doc) {
    if (err) throw err;
    Article.findByIdAndUpdate(req.params.id, { $set: { "note": doc._id } }, { new: true }, function(err, newdoc) {
      if (err) throw err;
      else {
        res.send(newdoc);
      }
    });
  });


});

app.get("/note/:id", function(req, res) {

  var id = req.params.id;
  Article.findById(id).populate("note").exec(function(err,data) {
    res.send(data.note);
  });

});