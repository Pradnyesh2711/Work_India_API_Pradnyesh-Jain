const express = require('express');
const router = express.Router();

 const jwt = require('jsonwebtoken');
 const bcrypt = require('bcryptjs');
 const { jwtSecret } = require('../config'); 

const pool = require('../models/db'); 

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const [results, fields] = await pool.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email]);

        res.status(201).json({
            status: 'Account successfully created',
            status_code: 201,
            user_id: results.insertId
        });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({
            status: 'Error creating account',
            status_code: 500,
            error: error.message
        });
    }
});



router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query to check if the user exists
        const [users, _] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            // User not found
            return res.status(401).json({
                status: 'Error',
                status_code: 401,
                message: 'Incorrect username/password provided. Please retry'
            });
        }

        const user = users[0];

        // Compare hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            // Incorrect password
            return res.status(401).json({
                status: 'Error',
                status_code: 401,
                message: 'Incorrect username/password provided. Please retry'
            });
        }

        // User authenticated successfully, generate JWT token
        const token = jwt.sign({ userId: user.user_id, username: user.username }, jwtSecret, { expiresIn: '1h' });

        // Send token and user details in response
        res.status(200).json({
            status: 'Login successful',
            status_code: 200,
            user_id: user.user_id,
            access_token: token
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            status: 'Error',
            status_code: 500,
            message: 'Error logging in',
            error: error.message
        });
    }
});



module.exports = router;
