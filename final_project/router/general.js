const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;  // Retrieve ISBN from the request parameters

  // Find the book by matching the ISBN (In this case, it's the book ID for testing)
  let book = books[isbn];  // We are treating the book ID as the "ISBN"

  if (book) {
    return res.status(200).json(book);  // Return the book details if found
  } else {
    return res.status(404).json({ message: "Book not found!" });  // If no book is found
  }
});


  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;  // Retrieve author from the request parameters
  let matchingBooks = [];  // To store books that match the author

  // Iterate through the books object and check if the author matches
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {  // Case-insensitive match
      matchingBooks.push(books[key]);  // Add matching book to the array
    }
  }

  // Check if we found any books
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);  // Return the list of books by the author
  } else {
    return res.status(404).json({ message: "No books found by this author" });  // If no books found
  }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;  // Retrieve title from the request parameters
  let matchingBooks = [];  // To store books that match the title

  // Iterate through the books object and check if the title matches
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {  // Case-insensitive match
      matchingBooks.push(books[key]);  // Add matching book to the array
    }
  }

  // Check if we found any books
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);  // Return the list of books matching the title
  } else {
    return res.status(404).json({ message: "No books found with this title" });  // If no books found
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
