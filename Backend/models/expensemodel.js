const mysql = require('mysql2');
const {db} = require('../db/db');

// Function to insert a new record into the "Income" table
const insertExpense = (amount, date, category, description) => {
  const insertSQL = `
    INSERT INTO expenses (amount, date, category, description)
    VALUES (?, ?, ?, ?);
  `;
   console.log('SQL Query:', insertSQL);
   console.log('Values:', [amount, date,category, description]);

  db.query(insertSQL, [amount, date, category, description], (err, results) => {
    if(err) {
        console.error('Error executing query:', err.sqlMessage);
        throw err;
    }
    console.log('Expense inserted with ID:', results.insertId);
  });
};

// Function to retrieve all records from the "Income" table
const getAllExpenses = (callback) => {
  const selectSQL = 'SELECT * FROM expenses';

  db.query(selectSQL, (err, results) => {
    if (err) throw err;
    callback(results);
  });
};

// Function to update a record in the "Income" table
const updateExpenses = (id, newAmount) => {
  const updateSQL = `
    UPDATE expenses
    SET amount = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?;
  `;

  db.query(updateSQL, [newAmount, id], (err, results) => {
    if (err) throw err;
    console.log('Expense updated:', results.affectedRows);
  });
};

// Function to delete a record from the "Income" table
const deleteExpense = (id) => {
  const deleteSQL = `
    DELETE FROM expenses
    WHERE id = ?;
  `;

  db.query(deleteSQL, [id], (err, results) => {
    if (err) throw err;
    console.log('Expense deleted:', results.affectedRows);
  });
};

// Export the functions
module.exports = {
  insertExpense,
  getAllExpenses,
  updateExpenses,
  deleteExpense
};


