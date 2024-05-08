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

// Function to check if the 'price' column exists in the 'cars' table
async function checkPriceColumn() {
    try {
        const result = await pool.query(
            `SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'cars' AND column_name = 'price'
      )`
        );
        return result.rows[0].exists;
    } catch (error) {
        console.error('Error checking for price column:', error);
        return false;
    }
}

// Function to add the 'price' column to the 'cars' table if it doesn't exist
async function createPriceColumn() {
    try {
        await pool.query('ALTER TABLE cars ADD COLUMN price VARCHAR(255)');
        console.log('Price column created successfully');
    } catch (error) {
        console.error('Error creating price column:', error);
    }
}

// POST API endpoint to insert data into the 'cars' table
app.post('/api/cars', async (req, res) => {
    const { brand, model, year, price,color } = req.body; // Extracting data from request body

    try {
        console.log('Inserted successfully')
        // Check if the 'price' column exists, if not, create it
        const priceColumnExists = await checkPriceColumn();
        if (!priceColumnExists) {
            await createPriceColumn();
        }

        // Insert data into the 'cars' table directly without parameterizing
        const result = await pool.query(
            `INSERT INTO cars (brand, model, year, price, color) VALUES ('${brand}', '${model}', ${year}, '${price}', '${color}') RETURNING *`
        );

        res.status(201).json(result.rows[0]); // Responding with inserted data
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
