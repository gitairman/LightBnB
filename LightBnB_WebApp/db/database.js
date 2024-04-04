const properties = require('./json/properties.json');
const users = require('./json/users.json');

// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'development',
//   password: 'development',
//   host: 'localhost',
//   database: 'lightbnb',
// });

const pool = require('./index');

// the following assumes that you named your connection variable `pool`
// pool.query(`SELECT title FROM properties LIMIT 10;`).then((response) => {
//   console.log(response);
// });

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
  // let resolvedUser = null;
  // for (const userId in users) {
  //   const user = users[userId];
  //   if (user && user.email.toLowerCase() === email.toLowerCase()) {
  //     resolvedUser = user;
  //   }
  // }
  // return Promise.resolve(resolvedUser);
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1;`, [id])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
  // return Promise.resolve(users[id]);
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  const values = [user.name, user.email, user.password];
  return pool
    .query(queryString, values)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `
    SELECT properties.*, AVG(rating) as average_rating, reservations.*
    FROM properties
    JOIN reservations ON reservations.property_id=properties.id
    JOIN property_reviews on property_reviews.property_id=properties.id
    WHERE reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY start_date
    LIMIT $2;
  `;
  const values = [Number(guest_id), limit];
  return pool
    .query(queryString, values)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const {
    city,
    owner_id,
    minimum_price_per_night,
    maximum_price_per_night,
    minimum_rating,
  } = options;

  const values = [];
  let queryString = `
    SELECT properties.*, AVG(rating) as average_rating
    FROM properties 
    JOIN property_reviews on property_reviews.property_id=properties.id
    `;

  let isWhereThere = false;
  if (city) {
    values.push(`%${city}%`);
    queryString += `WHERE city LIKE $${values.length} `;
    isWhereThere = true;
  }
  if (owner_id) {
    values.push(Number(owner_id));
    queryString += `${isWhereThere ? 'AND' : 'WHERE'} owner_id = $${
      values.length
    } `;
    isWhereThere = true;
  }
  if (minimum_price_per_night) {
    values.push(Number(minimum_price_per_night) * 100);
    queryString += `${isWhereThere ? 'AND' : 'WHERE'} cost_per_night >= $${
      values.length
    } `;
    isWhereThere = true;
  }
  if (maximum_price_per_night) {
    values.push(Number(maximum_price_per_night) * 100);
    queryString += `${isWhereThere ? 'AND' : 'WHERE'} cost_per_night <= $${
      values.length
    } `;
    isWhereThere = true;
  }

  queryString += `GROUP BY properties.id`;

  if (minimum_rating) {
    values.push(Number(minimum_rating));
    queryString += ` HAVING AVG(rating) >= $${values.length} `;
  }

  values.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${values.length};
  `;
  return pool
    .query(queryString, values)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const inputArr = Object.keys(property);
  const inputStr = inputArr.toString();
  const valueArr = Object.values(property).map((_, i) => `$${i + 1}`);
  const valueStr = valueArr.toString();

  const queryString = `
  INSERT INTO properties (${inputStr})
  VALUES (${valueStr})
  RETURNING *;
  `;
  const values = Object.entries(property).map(([key, val]) => {
    if (
      key === 'owner_id' ||
      key === 'parking_spaces' ||
      key === 'number_of_bathrooms' ||
      key === 'number_of_bedrooms'
    ) {
      return Number(val);
    }
    return val;
  });
  return pool
    .query(queryString, values)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
