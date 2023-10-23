const nodemailer = require("nodemailer");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginMethod = async (req, res) => {
  console.log(req.body.email, req.body);
  try {
    if (!req.body.email) {
      res.status(400).send("Fields are missing");
    }

    const userDetails = await User.findOne({
      email: req.body.email,
    });
    if (!userDetails) {
      res.status(400).send("U r not registered");
    }

    try {
      console.log("userdetails", userDetails);
      let comparePassowrd = await bcrypt.compare(
        req.body.password,
        userDetails.password
      );
      console.log("comparePassowrd", comparePassowrd);

      if (!comparePassowrd) {
        res.status(400).send("Password is wrong");
      }

      let token = await jwt.sign(
        {
          email: req.body.email,
        },
        "thisistheverybigsecretpassword"
      );
      console.log("token", token);

      if (token) {
        let response = {
          token: token,
          userDetails: userDetails,
        };
        console.log("response", response);

        let resObj = {
          message: "Login Successful",
          status: 200,
          error: null,
          token: token,
          result: userDetails,
        };
        return res.send(resObj);
      } else {
        res.status(400).send("unable to generate token");
      }
    } catch (error) {
      console.log("Password trycatch");
    }
  } catch (error) {
    console.log("Find userdetails");
  }
};

module.exports = {
  loginMethod,
};
