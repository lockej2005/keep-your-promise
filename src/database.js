const sqlite3 = require('sqlite3').verbose();

// Create and connect to the SQLite database
const db = new sqlite3.Database('promises.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the promises database.');
  }
});

// Create the promises table if it doesn't exist
const createTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS promises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT,
      status TEXT
    )`;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table "promises" created or already exists.');
    }
  });
};

// Initialize the database by creating the table
createTable();

// Function to add a new promise to the database
const addPromise = (text, status, callback) => {
  const insertPromiseQuery = 'INSERT INTO promises (text, status) VALUES (?, ?)';

  db.run(insertPromiseQuery, [text, status], (err) => {
    if (err) {
      console.error('Error adding promise:', err.message);
      callback(err);
    } else {
      console.log('Promise added successfully.');
      callback(null);
    }
  });
};

// Function to update the status of a promise
const updatePromiseStatus = (id, status, callback) => {
  const updateStatusQuery = 'UPDATE promises SET status = ? WHERE id = ?';

  db.run(updateStatusQuery, [status, id], (err) => {
    if (err) {
      console.error('Error updating promise status:', err.message);
      callback(err);
    } else {
      console.log('Promise status updated successfully.');
      callback(null);
    }
  });
};

// Function to retrieve all promises from the database
const getAllPromises = (callback) => {
  const selectAllPromisesQuery = 'SELECT * FROM promises';

  db.all(selectAllPromisesQuery, (err, rows) => {
    if (err) {
      console.error('Error retrieving promises:', err.message);
      callback(err, null);
    } else {
      console.log('Promises retrieved successfully.');
      callback(null, rows);
    }
  });
};

module.exports = {
  addPromise,
  updatePromiseStatus,
  getAllPromises,
};
