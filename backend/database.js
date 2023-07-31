// database.js

const sql = require('mssql');

const config = {
  user: 'lockej2005',
  password: 'T0mat0P0tat0',
  server: 'promisestatserver.database.windows.net',
  database: 'promisedb',
  options: {
    encrypt: true,
  },
};

const connectionPool = new sql.ConnectionPool(config).connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! ', err));

const addPromise = async (promise, status) => {
  try {
    const pool = await connectionPool;
    const result = await pool.request()
      .input('promise', sql.NVarChar, promise)
      .input('status', sql.NVarChar, status)
      .query('INSERT INTO promises (promise, status) VALUES (@promise, @status)');
    return result.rowsAffected;
  } catch (err) {
    console.log('Error running the query!', err);
  }
};

const updatePromiseStatus = async (id, status) => {
  try {
    const pool = await connectionPool;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.NVarChar, status)
      .query('UPDATE promises SET status = @status WHERE id = @id');
    return result.rowsAffected;
  } catch (err) {
    console.log('Error running the query!', err);
  }
};

const getAllPromises = async () => {
  try {
    const pool = await connectionPool;
    const result = await pool.request().query('SELECT * FROM promises');
    return result.recordset;
  } catch (err) {
    console.log('Error running the query!', err);
  }
};

module.exports = {
  addPromise,
  updatePromiseStatus,
  getAllPromises,
};
