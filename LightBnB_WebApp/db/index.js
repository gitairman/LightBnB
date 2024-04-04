const { Pool } = require('pg');

const pool = new Pool({
  user: 'development',
  password: 'development',
  host: 'localhost',
  database: 'lightbnb',
});

const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = { query };
