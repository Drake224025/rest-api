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

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, articles) => {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const article = new Article({
      title,
      content,
    });

    Article.create(article, (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all articles!");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:articleID")
  .get((req, res) => {
    Article.findById(req.params.articleID, (err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    Article.findByIdAndDelete(req.params.articleID, (err, db) => {
      if (!err) {
        res.send(db);
      } else {
        res.send(err);
      }
    });
  })
  .put((req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const article = {
      title,
      content,
    };
    const articleId = req.params.articleID;
    Article.findByIdAndUpdate(articleId, article, (err, db) => {
      if (!err) {
        res.send(db);
      } else {
        res.send(err);
      }
    });
  })
  .patch((req, res) => {
    const articleId = req.params.articleID;
    Article.findByIdAndUpdate(articleId, req.body, (err, db) => {
      if (!err) {
        res.send(db);
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
