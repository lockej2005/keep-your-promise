const express = require('express');
const router = express.Router();
const db = require('./database');

router.get('/get-promises', async (req, res) => {
  try {
    const promises = await db.getAllPromises();
    return res.status(200).json(promises);
  } catch (err) {
    return res.status(500).json({ error: 'Error retrieving promises.' });
  }
});

router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    await db.addUser(username, password, email);
    return res.status(200).json({ message: 'User added successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Error adding the user.' });
  }
});

router.post('/add-promise', async (req, res) => {
  const { promise, recusername, senusername, sentAt } = req.body;
  const status = 'active'; // Newly added promises are considered active by default

  try {
    await db.addPromise(promise, status, recusername, senusername, sentAt);
    return res.status(200).json({ message: 'Promise added successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Error adding the promise.' });
  }
});

router.put('/update-promise/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.updatePromiseStatus(id, status);
    return res.status(200).json({ message: 'Promise status updated successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Error updating the promise status.' });
  }
});

module.exports = router;
