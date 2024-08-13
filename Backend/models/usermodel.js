const mysql = require('mysql2');
const {db} = require('../db/db');
const bcrypt = require('bcrypt');

const createUser = async (username, email, password) => {
  const insertSQL = `
    INSERT INTO users (username, email, password)
    VALUES (?, ?, ?);
  `;
   console.log('SQL Query:', insertSQL);

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log('Values:', [username, email, hashedPassword]);

    db.query(insertSQL, [username,email, hashedPassword], (err, results) => {
    if(err) {
      console.error('Error executing query:', err.sqlMessage);
      throw err;
    }
    console.log('User created with ID:', results.insertId);
    });
  } catch (error) {
    console.error('Error during password hashing:', error.message);
    throw error
  }
};

const getUser = (email, password, res) => {
  const selectSQL = 'SELECT * FROM users WHERE email = ?';
  
  db.query(selectSQL, [email], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err.sqlMessage);
      return res.status(500).json({ message: 'Server Error!' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password!' });
    }

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      res.status(200).json({ message: 'Login successful', userId: user.id });
    } catch (error) {
      console.error('Error comparing password:', error.message);
      return res.status(500).json({ message: 'Server Error!' });
    }
  });
};

// Export the functions
module.exports = {
  createUser,
  getUser
};


