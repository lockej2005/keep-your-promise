const express = require('express');
const router = express.Router();
const db = require('./database');
const session = require('express-session');

router.use(session({
  secret: 'Your_Secret_Key',
  resave: false,
  saveUninitialized: true
}));

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.getUser(username, password);
  if(user) {
    req.session.username = username;
    res.status(200).json({ message: 'User logged in successfully.' });
  } else {
    res.status(401).json({ message: 'Invalid username or password.' });
  }
});

router.get('/get-promises', async (req, res) => {
  const senusername = req.session.username;
  if (!senusername) {
    return res.status(401).json({ message: 'User not logged in.' });
  }
  try {
    const promises = await db.getAllPromises(senusername); // pass senusername as parameter
    return res.status(200).json(promises);
  } catch (err) {
    return res.status(500).json({ error: 'Error retrieving promises.' });
  }
});

router.post('/add-promise', async (req, res) => {
  const { promise, recusername, senusername, sentAt } = req.body;
  const status = 'active';

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
