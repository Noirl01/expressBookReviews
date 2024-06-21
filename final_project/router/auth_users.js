const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "mohamed", password: "mohamed" }];

const isValid = (username) => {
  let user = users.filter((user) => user.username === username);
  if (user.length > 0) return true;
  else return false;
};

const authenticatedUser = (username, password) => {
  let user = users.filter(
    (user) => user.username === username && user.password === password
  );
  if (user.length > 0) return true;
  else return false;
};

regd_users.post("/login", (req, res) => {
  const userName = req.body.username || req.body.userName;
  const password = req.body.password;
  if (userName && password) {
    if (authenticatedUser(userName, password)) {
      let accessToken = jwt.sign(
        {
          data: userName,
        },
        "access",
        { expiresIn: 60 * 60 }
      );

      req.session.authorization = {
        accessToken,
        userName,
      };

      return res.status(200).json({ message: "Successful login" });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid login. Please check username/password" });
    }
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const review = req.query.review;
  const user = req.user.data;

  if (ISBN) {
    books[ISBN].reviews[user] = review;
    return res
      .status(202)
      .json({ message: `review of user ${user} has been added/updated` });
  } else {
    return res.status(404).json({ message: "ISBN not provided" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const user = req.user.data;

  if (ISBN && books[ISBN].reviews[user]) {
    delete books[ISBN].reviews[user];
    return res
      .status(202)
      .json({ message: `review of user ${user} has been deleted` });
  } else {
    return res
      .status(404)
      .json({ message: "User has no reviews or ISBN not provided" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
