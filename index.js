// Import the express library
const express = require("express");
const getMysqlConnection = require("./App/Connections/Database/MysQl");
const queryDatabase = require("./App/Model/MySql/Common");

// Create an instance of express
const app = express();

// Define a basic route
app.get("/", (req, res) => {
  res.send("Hello, World! 2");
});

// API endpoint to handle user requests
app.get("/data", async (req, res) => {
  const { dbId } = req.query;

  if (!dbId) {
    return res.status(400).send("Database ID is required.");
  }

  const dbName = `Air_organization_${dbId}`;

  try {
    // Query the database using the utility function
    const results = await queryDatabase(dbName, "SELECT * FROM land");

    // Send the results back to the user
    res.json(results);
  } catch (err) {
    // Send error if something goes wrong
    res.status(500).send(err);
  }
});

app.get("/create-db", async (req, res) => {
  const { dbId } = req.query;

  if (!dbId) {
    return res.status(400).send("Database ID is required.");
  }

  const dbName = `Air_organization_${dbId}`;

  // SQL to create the database and a test table inside it
  const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${dbName}`;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${dbName}.test_table (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      age INT
    )
  `;

  try {
    // First, create the new database
    await queryDatabase(null, createDbQuery);

    // Then, create the test table inside the new database
    await queryDatabase(dbName, createTableQuery);

    // Send a success response
    res.send(
      `Database '${dbName}' created and test_table created successfully.`
    );
  } catch (err) {
    // Send error if something goes wrong
    res.status(500).send(err);
  }
});
// Set the port the server will listen on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
