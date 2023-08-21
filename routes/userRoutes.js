const express = require("express");
const { UserModel } = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../model/blacklistModel");

const userRouter = express.Router();

//Registration
userRouter.post("/register", async (req, res) => {
  let user = req.body;
  try {
    let checkUser = await UserModel.findOne({ email: user?.email });
    if (checkUser) {
      res.status(200).send({ msg: "User already exist, please login" });
    } else {
      bcrypt.hash(user?.password, 5, async (err, hash) => {
        if (err) {
          res.status(400).send({ error: err });
        }
        let newUser = new UserModel({ ...user, password: hash });
        await newUser.save();
        res.status(200).send({ msg: "User registered successfully" });
      });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Login
userRouter.post("/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    let checkUser = await UserModel.findOne({ email: email });
    if (!checkUser) {
      res.status(200).send({ msg: "User Not Found !!" });
    } else {
      bcrypt.compare(password, checkUser?.password, async (err, result) => {
        if (!result) {
          res.status(200).send({ msg: "Wrong Password !!" });
        } else {
          var accessToken = jwt.sign({ userID: checkUser?._id, user: checkUser?.name }, "shatru47", {
            expiresIn: "7 days",
          });
          res
            .status(200)
            .send({ msg: "Logged-in successfully", token: accessToken });
        }
      });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Logout
userRouter.post("/logout", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  try {
    let blicklistToken = new BlacklistModel({ token });
    await blicklistToken.save();
    res.status(200).send({ msg: "Logged-out successfully" });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = {
  userRouter,
};
