const mysql = require('mysql2');

// Create a connection
const connection = mysql.createConnection({
    host: 'localhost',          // MySQL server address
    user: 'root',               // MySQL user (replace with your own)
    password: 'password',       // MySQL password (replace with your own)
    database: 'dining_reservation' // Database name
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Export the connection
module.exports = connection.promise();
