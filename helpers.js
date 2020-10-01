const getUserByEmail = function(email, database) {
  let user = false;
  for (let name in database) {
    if (email === database[name].email){
      user = name;
    }
  }
  return user;
};

module.exports = getUserByEmail;