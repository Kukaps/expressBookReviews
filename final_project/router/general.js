const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  // Extract username and password from the request body
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if username already exists
  if (users[username]) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // Register the new user
  users[username] = { password }; // Store username and password (password should ideally be hashed)

  return res.status(200).json({ message: "User registered successfully!" });
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


// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;  // Retrieve ISBN from the request parameters
  
  // Check if the ISBN exists in the books object
  if (books[isbn]) {
    const reviews = books[isbn].reviews;  // Get the reviews for that book
    if (Object.keys(reviews).length > 0) {  // If reviews exist
      return res.status(200).json(reviews);  // Return the reviews as a JSON response
    } else {
      return res.status(404).json({ message: "No reviews found for this book" });  // If no reviews
    }
  } else {
    return res.status(404).json({ message: "Book not found with this ISBN" });  // If book not found
  }
});


module.exports.general = public_users;
