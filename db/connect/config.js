const maria = require("mysql");

const connection = maria.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "unidev",
  password: "unidev123!",
  database: "univer_data",
});

module.exports = connection;
