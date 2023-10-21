const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const generateEmail = (data) => {
  if (data) {
    // const { userEmail } = req.body;

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
        name: "Admin",
        intro: "New order has arrived!",
        table: {
          data: [
            {
              flavourType: data.flavourType,
              quantity: data.quantity,
              price: data.price,
            },
          ],
        },
        outro: "",
      },
    };

    let mail = MailGenerator.generate(response);

    let message = {
      from: "chaitanyaang4@gmail.com",
      to: "7starhomebaker@gmail.com",
      subject: "New Order",
      html: mail,
    };

    transporter
      .sendMail(message)
      .then(() => {
        // return res.status(201).json({
        //   msg: "you should receive an email",
        // });
      })
      .catch((error) => {
        // return res.status(500).json({ error });
      });
  }
};

module.exports = {
  generateEmail,
};
