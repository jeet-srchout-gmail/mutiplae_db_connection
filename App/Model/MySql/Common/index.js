const getMysqlConnection = require("../../../Connections/Database/MysQl");

const queryDatabase = (dbName, query) => {
  return new Promise((resolve, reject) => {
    getMysqlConnection(dbName, (err, connection) => {
      if (err) {
        return reject("Failed to connect to database.");
      }

      connection.query(query, (error, results) => {
        if (error) {
          connection.release();
          return reject("Error executing query.");
        }

        connection.release(); // * Release the connection back to the pool
        resolve(results);
      });
    });
  });
};

module.exports = queryDatabase;
