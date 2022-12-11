const nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cemowo7@gmail.com",
    pass: "thddk5431!",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  smtpTransport,
};
