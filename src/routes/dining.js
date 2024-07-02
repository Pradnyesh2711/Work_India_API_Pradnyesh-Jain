

const express = require('express');
const router = express.Router();
const pool = require('../models/db'); 
// POST /api/dining - Add a new dining place
router.post('/dining', async (req, res) => {
    const { name, location, description } = req.body;

    try {
        
        const [results, fields] = await pool.execute('INSERT INTO dining_places (name, location, description) VALUES (?, ?, ?)', [name, location, description]);

        res.status(201).json({
            status: 'Dining place added successfully',
            status_code: 201,
            dining_place_id: results.insertId
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

router.get('/dining-places', async (req, res) => {
    try {
       
        const [results, fields] = await pool.execute('SELECT * FROM dining_places');

        res.status(200).json({
            status: 'Success',
            status_code: 200,
            dining_places: results
        });
    } catch (error) {
        console.error('Error fetching dining places:', error);
        res.status(500).json({
            status: 'Error',
            status_code: 500,
            error: error.message
        });
    }
});

module.exports = router;