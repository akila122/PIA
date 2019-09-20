//Stop-Process -Id (Get-NetTCPConnection -LocalPort 5001).OwningProcess -Force
const PORT = parseInt(process.env.PORT);
const DB_URI = process.env.DB_URI;
const expose = process.env.EXPOSE === 'true';
const mongoose = require("mongoose");
const express = require("express");

const path = require("path");
const cors = require("cors");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { setupSocket } = require("./socketControl/socketMain");
const { bodyParser, formParser } = require("./parsers/Parsers");
const ngrok = require("ngrok");

setupSocket(io);

mongoose
  .connect(DB_URI, { useNewUrlParser: true })
  .then(async connection => {
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.header("Access-Control-Allow-Methods", "*");
      next();
    });
    app.use(bodyParser);
    app.use(formParser);
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    app.use("/registration", require("./routes/RegistrationRouter"));
    app.use("/login", require("./routes/LoginRouter"));
    app.use("/supervisor", require("./routes/SupervisorRouter"));
    app.use("/GoD", require("./routes/GoDRouter"));

    let url = expose ? await ngrok.connect(PORT) : "http://localhost:" + PORT;

    let users = await require("./models/UserModel").UserModel.find();
    for (let user of users) {
      let arr = user.profileImageURL.split(".");
      user.profileImageURL =
        url + "/uploads/" + user.username + "." + arr[arr.length - 1];

      await user.save();
    }
    await http.listen(PORT);

    console.log("** Express.js server is listening on : " + url+" **");
    if (expose) console.log("Port exposed with ngrok at URL : " + url);
  })
  .catch(error => console.log(error));
