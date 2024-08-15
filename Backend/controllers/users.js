const { createUser, getUser } = require("../models/usermodel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;

exports.addUser = async (req, res) => {
    const { username, email, password } = req.body;

    // console.log('Received Data:', {username, email, password });

    try {
        if(!username || !email || !password){
            return res.status(400).json({message: 'All fields are required!'})
        }

        const existingUser = await getUser(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already in use! '});
        }

        await createUser(username, email, password);

        res.status(200).json({message: 'User created'});
    } catch (error) {
        console.error('Error adding user:', error.message || error);
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

        const user = await getUser(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message: 'Invalid email or password! '});
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.error('Error in login:', error.message || error); 
        res.status(500).json({ message: 'Server Error!' });
    }
};