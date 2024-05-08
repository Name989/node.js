// Import required modules
const express = require('express');
const { Pool } = require('pg');

// Initialize Express app
const app = express();
const port = 3000; // You can change the port as needed

// PostgreSQL database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'A123@123',
  port: 5432, // Default PostgreSQL port
});

// Middleware to parse JSON requests
app.use(express.json());

// GET API endpoint to fetch all cars from the 'cars' table
app.get('/api/cars', async (req, res) => {
  try {
    // Fetch all cars from the 'cars' table
    const result = await pool.query('SELECT * FROM cars');
    
    res.status(200).json(result.rows); // Respond with fetched data
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
