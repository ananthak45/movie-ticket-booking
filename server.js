const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Praveen@16',
  database: 'theater_management',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Route to check if `userid` exists in `admin` table
app.post('/api/admin/checkUser', (req, res) => {
  const { userid } = req.body;
  const query = 'SELECT * FROM admin WHERE userid = ?';

  db.query(query, [userid], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});

// Route to send OTP to phone number (mock OTP for testing)
app.post('/api/admin/sendOtp', (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP

  // Simulate OTP sending (in reality, send via SMS API)
  console.log(`OTP for ${phone} is ${otp}`);

  // Respond with the OTP for testing purposes
  res.json({ success: true, otp: otp.toString() });
});

// Route to register a new admin after OTP verification
app.post('/api/admin/register', async (req, res) => {
  const { userid, phone, password } = req.body;

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO admin (userid, phone, password) VALUES (?, ?, ?)';
  db.query(query, [userid, phone, hashedPassword], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error creating admin' });
    } else {
      res.json({ success: true, message: 'Admin registered successfully' });
    }
  });
});

// Route to authenticate an existing admin after OTP verification
app.post('/api/admin/login', (req, res) => {
  const { userid, password } = req.body;

  const query = 'SELECT * FROM admin WHERE userid = ?';
  db.query(query, [userid], async (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const admin = results[0];
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (passwordMatch) {
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Incorrect password' });
      }
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  });
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
