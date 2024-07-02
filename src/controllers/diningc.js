const db = require('../models/db');

exports.addDiningPlace = (req, res) => {
    const { name, description, location } = req.body;

    const query = 'INSERT INTO dining_places (name, description, location) VALUES (?, ?, ?)';
    db.query(query, [name, description, location], (err, result) => {
        if (err) return res.status(500).send(err);

        res.status(200).json({
            status: 'Dining place successfully added',
            status_code: 200,
            dining_place_id: result.insertId
        });
    });
};

exports.searchDiningPlaces = (req, res) => {
    const { name } = req.query;
    const query = 'SELECT * FROM dining_places WHERE name LIKE ?';
    const searchQuery = `%${name}%`;

    db.query(query, [searchQuery], (err, results) => {
        if (err) return res.status(500).send(err);

        res.status(200).json(results);
    });
};
