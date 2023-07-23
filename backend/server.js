// server.js

const express = require('express');
const app = express();
const apiRouter = require('./api');

// Middleware to parse incoming request bodies as JSON
app.use(express.json());

// Use the API router
app.use('/api', apiRouter);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
