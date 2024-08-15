const mysql = require('mysql2');
const {db} = require('../db/db');
const { resolve } = require('path');
const { rejects } = require('assert');

// Function to insert a new record into the "Income" table
const insertExpense = (userId, amount, date, category, description) => {
  return new Promise((resolve, reject) => {
    const insertSQL = `
    INSERT INTO expenses (userId, amount, date, category, description)
    VALUES (?, ?, ?, ?, ?);
  `;
   console.log('SQL Query:', insertSQL);
   console.log('Values:', [userId, amount, date,category, description]);

    db.query(insertSQL, [userId, amount, date, category, description], (err, results) => {
      if(err) {
          console.error('Error executing query:', err.sqlMessage);
          return reject(err);
      }
      console.log('Expense inserted with ID:', results.insertId);
      resolve(results.insertId);
    });
  });
};

// Function to retrieve all records from the "Income" table
const getAllExpenses = (userId) => {
  const selectSQL = 'SELECT * FROM expenses WHERE userId = ?';

  return new Promise((resolve, reject) => {
    db.query(selectSQL, [userId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err.sqlMessage);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Function to update a record in the "Income" table
const updateExpenses = (id, newAmount, callback) => {
  const updateSQL = `
    UPDATE expenses
    SET amount = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?;
  `;

  db.query(updateSQL, [newAmount, id], (err, results) => {
    if (err) {
      console.err('Error executing query:', err.sqlMessage);
      return callback(err, null);
    }
    console.log('Expense updated:', results.affectedRows);
    return callback(null, results.affectedRows);
  });
};

// Function to delete a record from the "Income" table
const deleteExpense = (id, callback) => {
  const deleteSQL = `
    DELETE FROM expenses
    WHERE id = ?;
  `;

  db.query(deleteSQL, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.sqlMessage);
      return callback(err, null);
    }
    console.log('Expense deleted:', results.affectedRows);
    return callback(null, results.affectedRows);
  });
};

// Export the functions
module.exports = {
  insertExpense,
  getAllExpenses,
  updateExpenses,
  deleteExpense
};


