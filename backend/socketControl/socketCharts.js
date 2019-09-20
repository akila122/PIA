let { UserModel } = require("../models/UserModel");
let { DuelModel } = require("../models/MatchModel");
let { GoDModel, PlayerGoDModel } = require("../models/GoDModels");


function chartsSetup(socket) {
  socket.on("getDuelChart", async username => {
    let date = new Date();
    let firstDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - 6,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );

    end = date.toISOString().split("T")[0];
    start = firstDay.toISOString().split("T")[0];

    let user = await UserModel.findOne({ username: username });
    let docs = await DuelModel.find({
      date: { $gte: start, $lte: end }
    })
      .and([
        { $or: [{ blueUser: user._id },{ redUser: user._id }] }
      ])
      .populate("blueUser")
      .populate("redUser")
      .exec();

    for (doc of docs) {
      doc.redUser._id = null;
      doc.redUser.password = null;
      doc.redUser.autAnswer = null;
      doc.redUser.personalId = null;

      doc.blueUser._id = null;
      doc.blueUser.password = null;
      doc.blueUser.autAnswer = null;
      doc.blueUser.personalId = null;
    }

    socket.emit("duelChart", docs);
  });

  socket.on("getGodChart", async data => {

   
    let username = data.username;
    let date =  require('moment').utc(data.date);
    let god = await GoDModel.findOne({ date: date });
    if (!god) socket.emit("godChart", "NO_GOD");
    else {
      let godPlayer = await PlayerGoDModel.find({ GoD: god._id });
      let senderPlayed = null;
      for (let i = 0; i < godPlayer.length; i++) {
        user = await UserModel.findById(godPlayer[i].player);

        user._id = null;
        user.password = null;
        user.autAnswer = null;
        user.personalId = null;
        godPlayer[i] = {
          user: user,
          points: godPlayer[i].points
        };
        if (user.username == username) senderPlayed = godPlayer[i];
      }

      godPlayer = godPlayer.sort((a, b) => -(a.points - b.points));

      if (godPlayer.length > 10) godPlayer.length = 10;

      socket.emit("godChart", { data: godPlayer, user: senderPlayed });
    }
  });

  socket.on("getMonthlyChart", async () => {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    end = date.toISOString().split("T")[0];
    start = firstDay.toISOString().split("T")[0];

    let docs = await DuelModel.find({
      date: { $gte: start, $lte: end }
    }).exec();

    let toReturn = {};

    for (let doc of docs) {
      if (toReturn[doc.blueUser] == undefined) {
        toReturn[doc.blueUser] = doc.bluePoints;
      } else {
        toReturn[doc.blueUser] += doc.bluePoints;
      }
      if (toReturn[doc.redUser] == undefined) {
        toReturn[doc.redUser] = doc.redPoints;
      } else {
        toReturn[doc.redUser] += doc.redPoints;
      }
    }

    let toArray = [];

    for (user in toReturn) {
      toArray.push({
        user: user,
        points: toReturn[user]
      });
    }

    toArray = toArray.sort((a, b) => -(a.points - b.points));

    for (x of toArray) {
      let user = await UserModel.findById(x.user).exec();
      user._id = null;
      user.password = null;
      user.autAnswer = null;
      user.personalId = null;
      x.user = user;
    }

    socket.emit("monthlyChart", toArray);
  });
  socket.on("get20Chart", async () => {
    let date = new Date();
    let firstDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - 19,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );

    end = date.toISOString().split("T")[0];
    start = firstDay.toISOString().split("T")[0];

    let docs = await DuelModel.find({
      date: { $gte: start, $lte: end }
    }).exec();

    let toReturn = {};

    for (let doc of docs) {
      if (toReturn[doc.blueUser] == undefined) {
        toReturn[doc.blueUser] = doc.bluePoints;
      } else {
        toReturn[doc.blueUser] += doc.bluePoints;
      }
      if (toReturn[doc.redUser] == undefined) {
        toReturn[doc.redUser] = doc.redPoints;
      } else {
        toReturn[doc.redUser] += doc.redPoints;
      }
    }

    let toArray = [];

    for (user in toReturn) {
      toArray.push({
        user: user,
        points: toReturn[user]
      });
    }

    toArray = toArray.sort((a, b) => -(a.points - b.points));

    for (x of toArray) {
      let user = await UserModel.findById(x.user).exec();
      user._id = null;
      user.password = null;
      user.autAnswer = null;
      user.personalId = null;
      x.user = user;
    }

    socket.emit("last20Chart", toArray);
  });
}
module.exports = { chartsSetup };
