const appConfig = require("../config/app");
// const User = require("../models/users");

const loadUser = async (req, res, next) => {
  try {
    const authZeroUser = await fetchAuthZeroUser(req.headers.authorization);

    req.user = authZeroUser;
    next();
  } catch {
    next();
  }
};

const fetchAuthZeroUser = async (authorizationValue) => {
  const response = await fetch(`${appConfig.authorizationHost}/userinfo`, {
    headers: { Authorization: authorizationValue },
  });

  return response.json();
};

const findOrCreateUser = async (authZeroUserJson) => {
  if (!authZeroUserJson) return;

  const existingUser = await User.findOne({ identifier: authZeroUserJson.sub });

  if (existingUser) return existingUser;

  const newUser = await User.create({
    identifier: authZeroUserJson.sub,
    email: authZeroUserJson.email,
    givenName: authZeroUserJson.given_name,
    familyName: authZeroUserJson.family_name,
    locale: authZeroUserJson.locale,
    picture: authZeroUserJson.picture,
  });

  return newUser;
};

module.exports = loadUser;
