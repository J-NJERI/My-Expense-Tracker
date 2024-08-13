const { createUser, getUser } = require("../models/usermodel");

exports.addUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        //validations
        // if(!username || !email || !password){
        //     return res.status(400).json({message: 'All fields are required!'})
        // }
    
        await createUser(username, email, password);

        res.status(200).json({message: 'User created'});
    } catch (error) {
        res.status(500).json({message: 'Server error!'});
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({message: 'All fields are required!'});
        }
        await getUser(email, password, res);

    } catch (error) {
        console.error('Error in login:', error.message);
        res.status(500).json({message: 'Server Error!'});
    }
};