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

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const ISBN = parseInt(req.params.isbn);
  if (books[ISBN]) {
    return res.status(200).json(books[ISBN]);
  }
  return res.status(404).json({ message: "Invalid ISBN" });
});

public_users.get("/author/:author", function (req, res) {
  const validSearch = {};
  const authorName = req.params.author.toLowerCase();
  for (const book in books) {
    if (books[book].author.toLowerCase().includes(authorName)) {
      validSearch[book] = {
        author: books[book].author,
        title: books[book].title,
        reviews: books[book].reviews,
      };
    }
  }
  return res.status(200).json(validSearch);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const validSearch = {};
  const bookTitle = req.params.title.toLowerCase();
  for (const book in books) {
    if (books[book].title.toLowerCase().includes(bookTitle)) {
      validSearch[book] = {
        author: books[book].author,
        title: books[book].title,
        reviews: books[book].reviews,
      };
    }
  }
  return res.status(200).json(validSearch);
});

public_users.get("/review/:isbn", function (req, res) {
  return res.status(200).json(books[req.params.isbn].reviews);
});

const getAllBooks = async () => {
  const data = await axios.get("http://localhost:5000/");
  return data;
};

const getBookByISBN = async (isbn) => {
  const data = await axios.get(`http://localhost:5000/isbn/${isbn}`);
  return data;
};

const getBookByAuthor = async (author) => {
  const data = await axios.get(`http://localhost:5000/author/${author}`);
  return data;
};

const getBookByTitle = async (title) => {
  const data = await axios.get(`http://localhost:5000/title/${title}`);
  return data;
};
module.exports.general = public_users;
