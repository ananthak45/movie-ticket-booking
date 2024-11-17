const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Praveen@16",
  database: "cinema",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Login endpoint
app.post("/api/admin/login", (req, res) => {
  const { userid, password } = req.body;
  const query = "SELECT * FROM admin WHERE userid = ? AND password = ?";

  db.query(query, [userid, password], (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ error: "Server error" });
    }
    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// Registration endpoint with duplicate userid handling
app.post("/api/admin/register", (req, res) => {
  const { userid, phone, password } = req.body;
  const query = "INSERT INTO admin (userid, phone, password) VALUES (?, ?, ?)";

  db.query(query, [userid, phone, password], (err, results) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "User ID not available" });
      } else {
        console.error("Error during registration:", err);
        return res.status(500).json({ error: "Server error" });
      }
    }
    res.json({ success: true });
  });
});

// Add Theater endpoint
app.post("/api/theaters/add", (req, res) => {
  const { userid, password, theatername, ownername, address, phone, email, instagram } = req.body;
  const query = `INSERT INTO theaters (userid, password, theatername, ownername, address, phone, email, instagram) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [userid, password, theatername, ownername, address, phone, email, instagram], (err, results) => {
    if (err) {
      console.error("Error adding theater:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json({ success: true });
  });
});

// Get Theater by User ID
app.get('/api/theaters/:userid', (req, res) => {
  const { userid } = req.params;
  db.query('SELECT * FROM theaters WHERE userid = ?', [userid], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    res.json(results[0]);
  });
});

// Route to add a new movie
app.post('/api/movies/add', (req, res) => {
  const { theatername, movieName, actors, genre, movieLink, showStartDate, showEndDate, showStartTime, showEndTime, ticketAmount } = req.body;

  // Validate that all required fields are present
  if (!theatername || !movieName || !actors || !movieLink || !genre || !showStartDate || !showEndDate || !showStartTime || !showEndTime || ticketAmount === undefined) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Prepare the SQL query
  const query = `INSERT INTO movies (theatername, movieName, actorsList, genre, showStartDate, showEndDate, showStartTime, showEndTime, ticketPrice, movieLink) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Execute the SQL query
  db.query(query, [theatername, movieName, actors, genre, showStartDate, showEndDate, showStartTime, showEndTime, ticketAmount, movieLink], (err, results) => {
    if (err) {
      console.error("Error adding movies:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json({ success: true, message: 'Movie added successfully', movieId: results.insertId });
  });
});

// Route to get all movies
app.get('/api/movies', (req, res) => {
  db.query('SELECT * FROM movies', (err, results) => {
    if (err) {
      console.error("Error retrieving movies:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json(results);
  });
});

// API endpoint to get distinct genres
app.get('/api/genres', (req, res) => {
  const query = 'SELECT DISTINCT genre FROM movies'; // Replace 'genre' with your column name
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching genres:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    const genres = results.map(row => row.genre); // Extracting genre strings from results
    res.json(genres);
  });
});

// API endpoint to get distinct theater names
app.get('/api/theaters', (req, res) => {
  const query = 'SELECT DISTINCT theatername FROM movies'; // Replace 'theatername' with your column name
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching theaters:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    const theaters = results.map(row => row.theatername); // Extracting theater names from results
    res.json(theaters);
  });
});

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
