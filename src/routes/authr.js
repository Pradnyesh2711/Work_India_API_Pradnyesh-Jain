const express = require('express');
const router = express.Router();


const pool = require('../models/db'); // Adjust the path as per your project structure

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
        // Query to check if the user exists and credentials match
        const [results, fields] = await pool.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (results.length > 0) {
            // User authenticated successfully
            res.status(200).json({
                status: 'Login successful',
                status_code: 200,
                user_id: results[0].user_id,
                access_token: 'your_access_token' // Generate and send an access token here
            });
        } else {
            // Authentication failed
            res.status(401).json({
                status: 'Incorrect username/password provided. Please retry',
                status_code: 401
            });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            status: 'Error logging in',
            status_code: 500,
            error: error.message
        });
    }
});


module.exports = router;
