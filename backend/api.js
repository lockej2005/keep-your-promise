// api.js

const express = require('express');
const router = express.Router();
const db = require('../src/database');

// API endpoint to add a new promise
router.post('/add-promise', (req, res) => {
  const { text } = req.body; // Expecting the promise text from the request body
  const status = 'active'; // Newly added promises are considered active by default

  db.addPromise(text, status, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error adding the promise.' });
    }

    return res.status(200).json({ message: 'Promise added successfully.' });
  });
});

// API endpoint to update the status of a promise
router.put('/update-promise/:id', (req, res) => {
  const { id } = req.params; // Get the promise ID from the URL parameter
  const { status } = req.body; // Get the updated status from the request body

  db.updatePromiseStatus(id, status, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating the promise status.' });
    }

    return res.status(200).json({ message: 'Promise status updated successfully.' });
  });
});

// API endpoint to fetch all promises
router.get('/get-promises', (req, res) => {
  db.getAllPromises((err, promises) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving promises.' });
    }

    return res.status(200).json(promises);
  });
});

module.exports = router;
