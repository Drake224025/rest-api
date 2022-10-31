const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = new mongoose.model("article", articleSchema);

//  GET requests
app.get("/articles", (req, res) => {
  Article.find({}, (err, articles) => {
    if (!err) {
      res.send(articles);
    } else {
      res.send(err);
    }
  });
});
app.get("/articles/:articleID", (req, res) => {
  Article.findById(String(req.params.articleID), (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      res.send(err);
    }
  });
});

//  Post requests
app.post("/articles", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const article = new Article({
    title,
    content,
  });
  console.log("article", req.body);

  Article.create(article, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      res.send(err);
    }
  });
});

// DELETE requests

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
