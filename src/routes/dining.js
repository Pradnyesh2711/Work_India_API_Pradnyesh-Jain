// dining.js

const express = require('express');
const router = express.Router();
const pool = require('../models/db'); // Adjust the path as per your project structure

// POST /api/dining - Add a new dining place
router.post('/dining', async (req, res) => {
    const { name, location, description } = req.body;

    try {
        // Example query to insert a new dining place into the database
        const [results, fields] = await pool.execute('INSERT INTO dining_places (name, location, description) VALUES (?, ?, ?)', [name, location, description]);

        res.status(201).json({
            status: 'Dining place added successfully',
            status_code: 201,
            dining_place_id: results.insertId // Assuming your query returns the inserted ID
        });
    } catch (error) {
        console.error('Error adding dining place:', error);
        res.status(500).json({
            status: 'Error adding dining place',
            status_code: 500,
            error: error.message
        });
    }
});

router.get('/dining-place', async (req, res) => {
    const { name } = req.query;

    try {
        // Example query to search dining places by name containing specific keywords
        const [results, fields] = await pool.execute('SELECT * FROM dining_places WHERE name LIKE ?', [`%${name}%`]);

        res.status(200).json({
            status: 'Dining places retrieved successfully',
            status_code: 200,
            dining_places: results
        });
    } catch (error) {
        console.error('Error searching dining places:', error);
        res.status(500).json({
            status: 'Error searching dining places',
            status_code: 500,
            error: error.message
        });
    }
});

module.exports = router;