const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: 'testuser', password: 'password123' },
  { username: 'john_doe', password: 'johnpassword' },
];

const secretKey = "fingerprint_customer";  // Use a secure key, ideally from environment variables

// Check if the username is valid (not already registered)
const isValid = (username) => {
  return !users.some(user => user.username === username);
}

// Check if the username and password match the ones in records
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// Register a new user (you should already have a registration route)
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the username already exists
  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // Create a new user and add them to the users array
  users.push({ username, password });

  console.log(users);
  return res.status(201).json({ message: "User registered successfully." });
});

// Login route for registered users
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the username exists and password is correct
  const user = users.find(user => user.username === username);
  if (!user || user.password !== password) {
    return res.status(400).json({ message: "Invalid username or password." });
  }

  // Generate a JWT token valid for 1 hour
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

  // Store token in session
  req.session.token = token;

  // Send the token in the response
  return res.status(200).json({
    message: "Login successful.",
    token: token
  });
});

// Add or modify a book review (for authenticated users only)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  // Check if the review is provided
  if (!review) {
    return res.status(400).json({ message: "Review content is required." });
  }

  // Check if the user is authenticated (you can verify the JWT token here)
  const token = req.headers['authorization']?.split(' ')[1];  // Assuming token is sent in the Authorization header

  if (!token) {
    return res.status(403).json({ message: "You must be logged in to add a review." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);  // Decode the token
    const username = decoded.username;  // Get the username from the decoded token

    // Add or modify the review for the book
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }

    // If the review already exists for the user, modify it
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/modified successfully." });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});

// Delete a book review (for authenticated users only)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  // Check if the user is authenticated (you can verify the JWT token here)
  const token = req.headers['authorization']?.split(' ')[1];  // Assuming token is sent in the Authorization header

  if (!token) {
    return res.status(403).json({ message: "You must be logged in to delete a review." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);  // Decode the token
    const username = decoded.username;  // Get the username from the decoded token

    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Check if the review exists and if it belongs to the logged-in user
    const review = books[isbn].reviews[username];
    if (!review) {
      return res.status(404).json({ message: "Review not found or you did not post this review." });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully." });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
