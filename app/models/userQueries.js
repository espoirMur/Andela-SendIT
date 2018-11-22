const queryCreate = {
  text: `INSERT INTO users(name, email,  passwordhash, phone, isAdmin) 
  VALUES($1, $2, $3, $4 ,$5) RETURNING *`,
  values: [],
}; // create and return the value created
const queryEmail = {
  text: 'SELECT * FROM users WHERE email = $1',
  values: [],
};

const queryId = {
  text: 'SELECT * FROM users WHERE id = $1',
  values: [],
};

export { queryCreate, queryEmail, queryId };
