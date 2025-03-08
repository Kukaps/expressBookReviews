const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Middleware to protect routes requiring authentication
app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if the user is authenticated
  if (req.session && req.session.token) {
    jwt.verify(req.session.token, "fingerprint_customer", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized access: Invalid token" });
      }
      req.user = decoded; // Attach user info to request
      next(); // Proceed to next middleware
    });
  } else {
    return res.status(401).json({ message: "Unauthorized access: No token provided" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
