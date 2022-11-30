const appConfig = require("../config/app");

const AuthorizationController = {
  login: (req, res) => {
    const authorizationUrl = `${
      appConfig.authorizationHost
    }/authorize?response_type=code&client_id=${
      appConfig.clientId
    }&redirect_uri=${encodeURIComponent(
      appConfig.redirectUrl
    )}&state=1234&scope=openid%20profile%20email`;

    res.redirect(authorizationUrl);
  },
  callback: async (req, res) => {
    // res.json(req.query.code);
    const response = await fetch(`${appConfig.authorizationHost}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: appConfig.clientId,
        client_secret: appConfig.clientSecret,
        redirect_uri: appConfig.redirectUrl,
        scope: "openid profile email",
        code: req.query.code,
      }),
    });

    const jsonResponse = await response.json();

    res.json(jsonResponse);
  },
};

module.exports = AuthorizationController;
