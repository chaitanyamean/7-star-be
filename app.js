require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/User");
const Service = require("./model/Service");
const CreateHomeWork = require("./model/CreateHomeWork");
const Orders = require("./model/Orders");
const Affliate = require("./model/Affliate");

const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middlewares/auth");
const server = require("http").createServer(app);
const uuid = require("uuid4");
const ClassStandard = require("./model/ClassStandard");
const Challenges = require("./model/Challenges");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dzgqn90ha",
  api_key: "671699842544666",
  api_secret: "AVMF89ZUkPI2rXiTG-YitUhgO0o",
});

app.get("/", (req, res) => {
  res.json({
    name: "krishna",
  });
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, usertype } = req.body;
    if (!(name && email && password)) {
      res.status(400).send("All fields are mandatory");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(410).send("Already exists");
    }

    const myEcryptPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: myEcryptPassword,
      usertype,
    });

    // Token
    const token = jwt.sign(
      { user_id: user._id, usertype },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    user.password = undefined;
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/addService", auth, async (req, res) => {
  try {
    const { serviceName, cost, changeBy } = req.body;

    if (!(serviceName && cost)) {
      res.status(400).send("All fields are mandatory");
    }

    const service = await Service.create({
      serviceName,
      cost,
      changeBy,
      serviceId: uuid(),
    });

    res.status(200).json(service);
  } catch (err) {
    console.log(err);
  }
});

app.post("/deleteService", auth, async (req, res) => {
  const { serviceId } = req.body;

  const getserviceId = await Service.deleteOne({ serviceId });
  console.log("GETSERVICE", getserviceId);
  res.status(200).json(getserviceId);
});

app.post("/login", async (req, res) => {
  try {
    const { employeeId } = req.body;
    console.log(req.body);

    if (!employeeId) {
      res.status(400).send("Fields are missing");
    }

    const user = await User.findOne({ employeeId });
    console.log(user);
    if (!user) {
      res.status(400).send("U r not registered");
    }

    // const pass = await bcrypt.compare(password, user.password);

    if (user) {
      // Token
      const token = jwt.sign(
        { user_id: user._id, employeeId },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      res.status(200).json(user);
    }

    res.status(400).send("U r not registered");
  } catch (error) {
    console.log(error);
  }
});

app.get("/getorders", async (req, res) => {
  try {
    const homeWork = await Orders.find({});
    console.log(homeWork);
    res.status(200).json(homeWork);
  } catch (err) {
    console.log(err);
  }
});

app.post("/raiseanorder", async (req, res) => {
  try {
    const {
      name,
      mobile,
      image,
      flavourType,
      quantity,
      location,
      date,
      comments,
      address,
    } = req.body;
    console.log("files", req.files);

    let url = "";
    if (req.files && req.files.image) {
      let file = req.files.image;
      console.log("FILES 160", file, req.body);
      result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "users",
      });
      console.log(result);
      url = result.secure_url;
    }
    console.log("URL", url);
    const raiseAnOrder = await Orders.create({
      name,
      mobile,
      image: url,
      flavourType,
      quantity,
      location,
      date,
      comments,
      address,
      orderId: uuid(),
    });

    res.status(200).send(raiseAnOrder);
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
