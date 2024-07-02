const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

exports.signup = (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, email], (err, result) => {
        if (err) return res.status(500).send(err);

        res.status(200).json({
            status: 'Account successfully created',
            status_code: 200,
            user_id: result.insertId
        });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(401).json({ status: 'Incorrect username/password provided. Please retry', status_code: 401 });

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ status: 'Incorrect username/password provided. Please retry', status_code: 401 });

        const token = jwt.sign({ id: user.id, role: user.role }, 'secret', { expiresIn: 86400 });

        res.status(200).json({
            status: 'Login successful',
            status_code: 200,
            user_id: user.id,
            access_token: token
        });
    });
};
