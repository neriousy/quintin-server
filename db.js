const mysql = require('mysql2');
const auth = require('./dbAuth.json');


module.exports = mysql.createConnection({
  host: auth.host,
  user: auth.user,
  password: auth.password,
  database: auth.database
});

