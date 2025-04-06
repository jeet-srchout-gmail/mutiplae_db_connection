const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the number of connections based on your requirement
  host: "database-2.ct6eukq6ijkk.ap-south-1.rds.amazonaws.com",
  port: 3306,
  database: "Air_user_dev_v1", // This can be dynamic per user as well
  user: "developer",
  password: "ACfh29GPTr",
  multipleStatements: true,
});

const getMysqlConnection = (dbName, callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(`Error getting connection from pool for ${dbName}:`, err);
      return callback(err, null);
    }

    // Dynamically switch the database for the connection
    connection.changeUser({ database: dbName }, (err) => {
      if (err) {
        console.error(`Error changing to ${dbName} database:`, err);
        connection.release();
        return callback(err, null);
      }
      //   console.log(`Using ${dbName} database.`);
      callback(null, connection); // Pass the connection to the callback
    });
  });
};

module.exports = getMysqlConnection;
