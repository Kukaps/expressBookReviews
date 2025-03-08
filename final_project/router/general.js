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

// Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
  try {
    // Simulate asynchronous book fetching from the local database (booksdb.js)
    const booksList = await new Promise((resolve) => {
      resolve(books);  // This is where you would fetch your books from the database or external source
    });
    return res.status(200).json({ books: booksList });  // Return the books list in response
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books.", error: error.message });
  }
});


// Get book details based on ISBN using Async/Await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;  // Retrieve ISBN from the request parameters
  
    try {
      let book = await new Promise((resolve, reject) => {
        resolve(books[isbn]);  // Simulate fetching the book details asynchronously by ISBN
      });
  
      if (book) {
        return res.status(200).json(book);  // Return the book details if found
      } else {
        return res.status(404).json({ message: "Book not found!" });  // If no book found
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching book details.", error: error.message });
    }
  });
  

  
// Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;  // Retrieve author from the request parameters
    let matchingBooks = [];  // To store books that match the author
  
    try {
      // Simulate fetching books based on the author's name asynchronously
      for (let key in books) {
        let book = await new Promise((resolve, reject) => {
          resolve(books[key]);
        });
  
        if (book.author.toLowerCase() === author.toLowerCase()) {
          matchingBooks.push(book);  // Add matching book to the array
        }
      }
  
      if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);  // Return the list of books by the author
      } else {
        return res.status(404).json({ message: "No books found by this author" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by author.", error: error.message });
    }
  });
  


// Get all books based on title using Async/Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;  // Retrieve title from the request parameters
    let matchingBooks = [];  // To store books that match the title
  
    try {
      // Simulate fetching books based on the title asynchronously
      for (let key in books) {
        let book = await new Promise((resolve, reject) => {
          resolve(books[key]);
        });
  
        if (book.title.toLowerCase() === title.toLowerCase()) {
          matchingBooks.push(book);  // Add matching book to the array
        }
      }
  
      if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);  // Return the list of books matching the title
      } else {
        return res.status(404).json({ message: "No books found with this title" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by title.", error: error.message });
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
