const { GoDModel, PlayerGoDModel } = require("../models/GoDModels");
const { UserModel } = require("../models/UserModel");

function godSetup(socket) {
  socket.on("getGod", async data => {
    let timeStamp = require("moment")
      .utc(data.timeStamp)
      .format();
    let username = data.username;
    let dataToSend = {};

    let god = await GoDModel.findOne({ date: timeStamp })
      .populate("game")
      .exec();
    if (god) {
      let user = await UserModel.findOne({ username: username }).exec();
      let playerGod = await PlayerGoDModel.findOne({
        player: user._id,
        GoD: god._id
      });
      if (playerGod) {
        dataToSend = "ERROR_ALREADY_PLAYED";
      } else {
        dataToSend.GoD = god;
      }
    } else {
      dataToSend = "NO_GOD";
    }
    socket.emit("godData", dataToSend);
  });
  socket.on("setGodPlayer", async data => {
    PlayerGoDModel.findByIdAndUpdate(data.gameId, {
      points: data.points
    }).exec();
  });

  socket.on("playGod", async data => {
  
    let user = await UserModel.findOne({ username: data.username }).exec();
    let god = await PlayerGoDModel.create({
      player: user._id,
      GoD: data.god_id,
      points: 0
    });
    socket.emit("godId",god._id);
  });

  socket.on("godFinish",data=>{
    
    PlayerGoDModel.findByIdAndUpdate(data.god_id,{points:data.points}).exec();
  })
}

module.exports = { godSetup };
