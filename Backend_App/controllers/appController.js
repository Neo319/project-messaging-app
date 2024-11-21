require("dotenv").config();

const dashboard_get = (req, res) => {
  const authHeader = req.headers.authorization;
  console.log("authorization recieved: ", authHeader);

  if (!authHeader) {
    return res.status(401).send("Not authorized: missing login token.");
  } else {
    return res.status(200).send(`Authorized with header: ${authHeader}`);
  }
};

module.exports = {
  dashboard_get,
  //
};
