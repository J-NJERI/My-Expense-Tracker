const mysql = require('mysql2');
const {db} = require('../db/db');
const bcrypt = require('bcrypt');
const { resolve } = require('path');
const { rejects } = require('assert');

const createUser = async (username, email, password) => {
  const insertSQL = `
    INSERT INTO users (username, email, password)
    VALUES (?, ?, ?);
  `;
   console.log('SQL Query:', insertSQL);

  try {
    if (typeof password !== 'string' || password.length === 0) {
      throw new Error('Invalid password!');
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log('Values:', [username, email, hashedPassword]);

    return new Promise((resolve, reject) => {
      db.query(insertSQL, [username,email, hashedPassword], (err, results) => {
        if(err) {
          console.error('Error executing query:', err.sqlMessage);
          return reject(err);
        }
        console.log('User created with ID:', results.insertId);
        resolve(results);
        });
    });
  } catch (error) {
    console.error('Error during password hashing:', error.message);
    throw error;
  }
};

const getUser = (email) => {
  const selectSQL = 'SELECT * FROM users WHERE email = ?';
  
  return new Promise((resolve, reject) => {
    db.query(selectSQL, [email], async (err, results) => {
      if (err) {
        console.error('Error fetching user:', err.sqlMessage);
        return reject({ statusCode: 500, message: 'Server Error!' });
      }

      if (results.length === 0) {
        return resolve(null);
      }

      const user = results[0];

      try {
        resolve(user);
      } catch (error) {
        console.error('Error:', error.message);
        reject(new Error('Server Error!'));
      }
    });
  });
};


// Export the functions
module.exports = {
  createUser,
  getUser
};


