const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Replace these values with your PostgreSQL connection details
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'A123@123',
    port: 5432, // Default PostgreSQL port
});

// Create a table
async function createTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email EMAIL(100),
      contact VARCHAR(11),
    )
  `;
    try {
        const client = await pool.connect();
        await client.query(query);
        console.log('Table created successfully');
        client.release();
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

// Insert a row
async function insertRow() {
    const query = `
    INSERT INTO users (name, email, contact) VALUES ($1, $2, $3)
  `;
    const values = ['John Doe', 'john@example.com', '123456789'];
    try {
        const client = await pool.connect();
        await client.query(query, values);
        console.log('Row inserted successfully');
        client.release();
    } catch (error) {
        console.error('Error inserting row:', error);
    }
}

app.get('/', async (req, res) => {
    try {
        await createTable();
        await insertRow();
        res.send('Data inserted into PostgreSQL');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
});
