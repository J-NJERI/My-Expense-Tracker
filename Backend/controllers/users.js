const { createUser, getUser } = require("../models/usermodel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;

exports.addUser = async (req, res) => {
    const { username, email, password } = req.body;

    // console.log('Received Data:', {username, email, password });
    try {
        //validations
        if(!username || !email || !password){
            return res.status(400).json({message: 'All fields are required!'})
        }
    
        await createUser(username, email, password);

        res.status(200).json({message: 'User created'});
    } catch (error) {
        console.error('Error adding user:', error.message);
        res.status(500).json({message: 'Server error!'});
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // console.log('Received Data:', { email, password });

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        const user = await getUser(email, password);

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.error('Error in login:', error.message || error); 
        const { statusCode = 500, message = 'Server Error!' } = error || {};
        res.status(statusCode).json({ message });
    }
};