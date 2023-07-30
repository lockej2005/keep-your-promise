// api.js

const express = require('express');
const router = express.Router();
const db = require('./database');

// API endpoint to fetch all promises
router.get('/get-promises', async (req, res) => {
  try {
    const promises = await db.getAllPromises();
    return res.status(200).json(promises);
  } catch (err) {
    return res.status(500).json({ error: 'Error retrieving promises.' });
  }
});

// API endpoint to add a new promise
router.post('/add-promise', async (req, res) => {
  const { promise } = req.body; // Expecting the promise promise from the request body
  const status = 'active'; // Newly added promises are considered active by default

  try {
    await db.addPromise(promise, status);
    return res.status(200).json({ message: 'Promise added successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Error adding the promise.' });
  }
});

// API endpoint to update the status of a promise
router.put('/update-promise/:id', async (req, res) => {
  const { id } = req.params; // Get the promise ID from the URL parameter
  const { status } = req.body; // Get the updated status from the request body

  try {
    await db.updatePromiseStatus(id, status);
    return res.status(200).json({ message: 'Promise status updated successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Error updating the promise status.' });
  }
});

module.exports = router;
