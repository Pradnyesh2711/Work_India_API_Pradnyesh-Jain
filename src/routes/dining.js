

const express = require('express');
const router = express.Router();
const pool = require('../models/db'); 
// POST /api/dining - Add a new dining place
router.post('/dining', async (req, res) => {
    const { name, location, description, opening_time, closing_time } = req.body;

    try {
        // Insert new dining place into database with opening and closing times
        const [results, _] = await pool.execute(
            'INSERT INTO dining_places (name, location, description, opening_time, closing_time) VALUES (?, ?, ?, ?, ?)',
            [name, location, description, opening_time, closing_time]
        );

        // Respond with success message and inserted dining place ID
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


router.post('/dining-place/availability', async (req, res) => {
    const { name, start_time, end_time } = req.body;

    try {
        // Query to get place_id based on name
        const [placeResults, _] = await pool.execute(
            'SELECT name FROM dining_places WHERE name = ?',
            [name]
        );

        if (placeResults.length === 0) {
            // If no dining place found with the given name
            return res.status(404).json({
                status: 'Dining place not found',
                status_code: 404
            });
        }

        const place_id = placeResults[0].place_id;
        const phone_no = placeResults[0].phone_no;

        // Logic to check availability using place_id, start_time, and end_time
        // Implement your availability check here

        // For illustration purposes, assume availability is always true
        const isAvailable = true;
        let nextAvailableSlot = null;

        if (!isAvailable) {
            // Determine the next available slot logic here if needed
            nextAvailableSlot = "2023-01-01T17:00:00Z";
        }

        res.status(200).json({
            place_id,
            name,
            phone_no,
            available: isAvailable,
            next_available_slot: nextAvailableSlot
        });

    } catch (error) {
        console.error('Error checking dining place availability:', error);
        res.status(500).json({
            status: 'Error checking dining place availability',
            status_code: 500,
            error: error.message
        });
    }
});
// Function to check if a time falls within opening hours
function isWithinOpeningHours(openingTime, closingTime, checkTime) {
    return checkTime >= openingTime && checkTime <= closingTime;
}

module.exports = router;