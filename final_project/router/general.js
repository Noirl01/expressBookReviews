const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");
public_users.post("/register", (req, res) => {
  const userName = req.body.username || req.body.userName;
  const password = req.body.password;
  if (userName && password) {
    if (isValid(userName)) {
      return res.status(406).json({ message: "Username already exists." });
    }
    users.push({ username: userName, password: password });
    return res
      .status(201)
      .json({ message: "User has been successfully created." });
  } else {
    return res
      .status(400)
      .json({ message: "Please provide username/password" });
  }
});

public_users.get("/", async function (req, res) {
  const booksList = await books;
  return res.status(200).json(booksList);
});

public_users.get("/isbn/:isbn", async function (req, res) {
  const ISBN = parseInt(req.params.isbn);
  const booksList = await books;
  if (booksList[ISBN]) {
    return res.status(200).json(booksList[ISBN]);
  }
  return res.status(404).json({ message: "Invalid ISBN" });
});

public_users.get("/author/:author", async function (req, res) {
  const validSearch = {};
  const authorName = req.params.author.toLowerCase();
  const dataPromise = new Promise((resolve, reject) => {
    if (books) resolve(books);
    else reject({ message: "Error while retrieving data" });
  }).then((data) => {
    for (const book in data) {
      if (data[book].author.toLowerCase().includes(authorName)) {
        validSearch[book] = {
          author: data[book].author,
          title: data[book].title,
          reviews: data[book].reviews,
        };
      }
    }
    return res.status(200).json(validSearch);
  });
});

public_users.get("/title/:title", async function (req, res) {
  const validSearch = {};
  const bookTitle = req.params.title.toLowerCase();
  const dataPromise = new Promise((resolve, reject) => {
    if (books) resolve(books);
    else reject({ message: "Error while retrieving data" });
  }).then((data) => {
    for (const book in data) {
      if (data[book].title.toLowerCase().includes(bookTitle)) {
        validSearch[book] = {
          author: data[book].author,
          title: data[book].title,
          reviews: data[book].reviews,
        };
      }
    }
    return res.status(200).json(validSearch);
  });
});

public_users.get("/review/:isbn", function (req, res) {
  return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
