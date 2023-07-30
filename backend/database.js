const sql = require('mssql');

// Configuration object for your Azure SQL Server
const config = {
  user: 'your_username_here',
  password: 'your_password_here',
  server: 'promisestatserver.database.windows.net', 
  database: 'promisedb',
  options: {
    encrypt: true
  }
};

// Function to add a new promise to the database
const addPromise = async (text, status, callback) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('text', sql.NVarChar, text)
      .input('status', sql.NVarChar, status)
      .query('INSERT INTO promises (promise, status) VALUES (@text, @status)');

    console.log('Promise added successfully.');
    callback(null);
  } catch (err) {
    console.error('Error adding promise:', err.message);
    callback(err);
  }
};

// Function to update the status of a promise
const updatePromiseStatus = async (id, status, callback) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('status', sql.NVarChar, status)
      .input('id', sql.Int, id)
      .query('UPDATE promises SET status = @status WHERE id = @id');

    console.log('Promise status updated successfully.');
    callback(null);
  } catch (err) {
    console.error('Error updating promise status:', err.message);
    callback(err);
  }
};

// Function to retrieve all promises from the database
const getAllPromises = async (callback) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query('SELECT * FROM promises');

    console.log('Promises retrieved successfully.');
    callback(null, result.recordset);
  } catch (err) {
    console.error('Error retrieving promises:', err.message);
    callback(err, null);
  }
};

module.exports = {
  addPromise,
  updatePromiseStatus,
  getAllPromises,
};
