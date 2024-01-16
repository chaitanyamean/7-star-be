require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/User");
const Service = require("./model/Service");
const CreateHomeWork = require("./model/CreateHomeWork");
const Orders = require("./model/Orders");
const Affliate = require("./model/Affliate");
const Flavours = require("./model/Flavours");
const Quantity = require("./model/Quantity");
const Prices = require("./model/Prices");
const Questions = require("./model/Questions");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const appRoute = require("./routes/appRoutes");
// const appRoute = require("./routes/appRoutes.js");
// app.use("/api", appRoute);
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
const { generateEmail } = require("./generateEmail.js");
app.use("/api", appRoute);

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
  res.status(200).json(getserviceId);
});

app.post("/login", async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      res.status(400).send("Fields are missing");
    }

    const user = await User.findOne({ employeeId });
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
    const homeWork = await Orders.find({}).sort({ created_at: -1 });
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
      price,
    } = req.body;

    let url = "";
    if (req.files && req.files.image) {
      let file = req.files.image;
      result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "users",
      });
      url = result.secure_url;
    }

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
      price,
      status: "",
      orderId: uuid(),
    });
    res.status(200).send(raiseAnOrder);
    generateEmail(raiseAnOrder);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Error While Saving" });
  }
});

app.post("/updateorder", async (req, res) => {
  try {
    const { status, orderId } = req.body;
    const raiseAnOrder = await Orders.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );
    if (raiseAnOrder) {
      res.status(200).send(raiseAnOrder);
    } else {
      res.status(500).send({ error: "Unable to update" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Error While Saving" });
  }
});

app.post("/addflavours", async (req, res) => {
  try {
    const { flavourName } = req.body;
    const flavours = await Flavours.create({
      flavourId: uuid(),
      flavourName,
    });
    res.status(200).send(flavours);
  } catch (err) {
    console.log(err);
  }
});

app.post("/updateflavours", async (req, res) => {
  try {
    const { flavourId, image } = req.body;
    console.log("FLAVOURSID", flavourId, image);
    const flavoursDetails = await Flavours.findOneAndUpdate(
      { flavourId },
      { image },
      { new: true }
    );
    if (flavoursDetails) {
      res.status(200).send(flavoursDetails);
    } else {
      res.status(404).send({ data: "No Data" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/getallflavours", async (req, res) => {
  try {
    const allFlavours = await Flavours.find({});
    res.status(200).json(allFlavours);
  } catch (err) {
    console.log(err);
  }
});

app.post("/addquantity", async (req, res) => {
  try {
    const { quantityName } = req.body;
    const quantityData = await Quantity.create({
      quantityId: uuid(),
      quantityName,
    });
    res.status(200).send(quantityData);
  } catch (err) {
    console.log(err);
  }
});

app.get("/getallquanties", async (req, res) => {
  try {
    const allQuantites = await Quantity.find({});
    res.status(200).json(allQuantites);
  } catch (err) {
    console.log(err);
  }
});

app.post("/addprices", async (req, res) => {
  try {
    const { quantity, flavourName, price } = req.body;
    const pricesData = await Prices.create({
      priceId: uuid(),
      quantity,
      flavourName,
      price,
    });
    res.status(200).send(pricesData);
  } catch (err) {
    console.log(err);
  }
});

app.post("/addquestions", async (req, res) => {
  try {
    const { problemName, code, type } = req.body;
    const questionsData = await Questions.create({
      questionId: uuid(),
      problemName,
      code,
      type,
    });
    res.status(200).send(questionsData);
  } catch (err) {
    console.log(err);
  }
});

app.get("/getallquestions", async (req, res) => {
  try {
    const allQuestions = await Questions.find({});
    res.status(200).json(allQuestions);
  } catch (err) {
    console.log(err);
  }
});

app.put("/editprices", async (req, res) => {
  try {
    const { quantity, flavourName, price, priceId } = req.body;
    const pricesData = await Prices.findOneAndUpdate(
      { priceId },
      { quantity, flavourName, price },
      { new: true }
    );
    if (pricesData) {
      res.status(200).send(pricesData);
    } else {
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/getallprices", async (req, res) => {
  try {
    const allPrices = await Prices.find({});
    res.status(200).json(allPrices);
  } catch (err) {
    console.log(err);
  }
});

app.post("/getpricebyquantity", async (req, res) => {
  try {
    const { quantity, flavourName } = req.body;
    const allPrices = await Prices.find({ quantity, flavourName });
    res.status(200).json(allPrices);
  } catch (err) {
    res.status(500).json({ errorMessage: "No Data found" });
  }
});

app.delete("/deletePrice/:id", async (req, res) => {
  try {
    const priceId = req.params.id;
    const deletePrice = await Prices.findOneAndDelete({ priceId });
    if (deletePrice) {
      res.status(200).send(deletePrice);
    } else {
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/sendemail", (req, res) => {
  const { userEmail } = req.body;

  let config = {
    service: "gmail",
    auth: {
      user: "chaitanyaang4@gmail.com",
      pass: "dtlspkbcrioxtxhw",
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "7 Star Bakers",
      link: "https://7-stars-bakery.netlify.app/admin/dashboard",
    },
  });

  let response = {
    body: {
      name: "Daily Tuition",
      intro: "Your bill has arrived!",
      table: {
        data: [
          {
            item: "Nodemailer Stack Book",
            description: "A Backend application",
            price: "$10.99",
          },
        ],
      },
      outro: "Looking forward to do more business",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: "chaitanyaang4@gmail.com",
    to: userEmail,
    subject: "New Order",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: "you should receive an email",
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
});

module.exports = app;
