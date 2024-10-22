const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'student_system'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Handle login requests
app.post('/login', (req, res) => {
    const studentNumber = req.body.studentNumber;
    const password = req.body.password;

    const query = 'SELECT * FROM users WHERE student_number = ?';
    db.query(query, [studentNumber], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            // Check password
            const user = result[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (isMatch) {
                    res.send('Login successful');
                } else {
                    res.send('Incorrect password');
                }
            });
        } else {
            res.send('Student not found');
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});