const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// MySQL connection setup
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test the database connection
connection.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    connection.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    connection.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 3. Filter patients by First Name
app.get('/patients/filter', (req, res) => {
    const firstName = req.query.first_name; // Get first_name from query parameters
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    
    connection.query(query, [firstName], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/filter', (req, res) => {
    const specialty = req.query.specialty; // Get specialty from query parameters
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    
    connection.query(query, [specialty], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
