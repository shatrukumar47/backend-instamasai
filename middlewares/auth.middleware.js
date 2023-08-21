const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../model/blacklistModel");

const auth = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    let blacklisted = await BlacklistModel.findOne({ token: token });
    if (blacklisted) {
      res.status(200).send({ msg: "Please login !!" });
    } else {
      jwt.verify(token, "shatru47", async (err, decoded) => {
        if (err) {
          res.status(200).send({ "error": err });
        }
        if(decoded){
            req.body.userID = decoded.userID;
            req.body.user = decoded.user;
            next();
        }
      });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
};

module.exports = {
  auth,
};
