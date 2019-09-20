let { sockets, games, socketsRW, gamesRW } = require("./data");
const { GrailModel } = require("../models/GameModels");

function grailSetup(socket) {
  socket.on("grailComponentLoaded", async gameId => {
    await gamesRW.startRead();
    let game = games[gameId];
    await gamesRW.endRead();

    await game.wait();
    if (game.grailData == undefined) {
      let count = await GrailModel.count().exec();
      let rnd1 = Math.floor(Math.random() * count);
      let rnd2 = Math.floor(Math.random() * count);
      while (rnd2 == rnd1) rnd2 = Math.floor(Math.random() * count);
      let g1 = await GrailModel.findOne()
        .skip(rnd1)
        .exec();
      let g2 = await GrailModel.findOne()
        .skip(rnd2)
        .exec();

      game.grailData = {
        grails: [g1, g2],
        userType: "blueUser",
        iter: 0,
        wasGiven: [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false
        ],
        points: {
          bluePoints: 0,
          redPoints: 0
        }
      };
    }
    socket.emit("grailData", game.grailData.grails);
    game.signal();
  });
  socket.on("grailDataLoaded", async gameId => {
    await gamesRW.startRead();
    let game = games[gameId];
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username];
    let redSocket = sockets[game.redUser.username];
    await socketsRW.endRead();

    await game.wait();
    if (game.grailData.sync == undefined) {
      game.grailData.sync = "ACK";
    } else {
      blueSocket.emit("grailGameBegin");
      redSocket.emit("grailGameBegin");
    }
    game.signal();
  });

  socket.on("grailUserAnswer", async data => {
    await gamesRW.startRead();
    let game = games[data.gameId];
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username];
    let redSocket = sockets[game.redUser.username];
    await socketsRW.endRead();

    await game.wait();

    if (data.gotRight) {
      game.grailData.points[
        data.userType == "blueUser" ? "bluePoints" : "redPoints"
      ] += 3;
      game[data.userType == "blueUser" ? "bluePoints" : "redPoints"] += 3;
      if (++game.grailData.iter == 13) {
        game.grailData.iter = 0;
        game.grailData.wasGiven.forEach((val, i, arr) => (arr[i] = false));
        game.grailData.userType = "redUser";
        let toEmit = {
          redPoints: game.redPoints,
          bluePoints: game.bluePoints,
          prevInfo: data.userType
        };
        blueSocket.emit("grailNext", toEmit);
        redSocket.emit("grailNext", toEmit);
      } else {
        let toEmit = {
          redPoints: game.redPoints,
          bluePoints: game.bluePoints,
          prevInfo: data.userType,
          position: data.userType == "blueUser"
        };
        blueSocket.emit("grailUpdate", toEmit);
        redSocket.emit("grailUpdate", toEmit);
      }
    } else {
      if (!game.grailData.wasGiven[game.grailData.iter]) {
        game.grailData.wasGiven[game.grailData.iter] = true;
        let toEmit = {
          redPoints: game.redPoints,
          bluePoints: game.bluePoints,
          position: data.userType == "blueUser" ? false : true
        };
        blueSocket.emit("grailUpdate", toEmit);
        redSocket.emit("grailUpdate", toEmit);
      } else {
        let toEmit = {
          redPoints: game.redPoints,
          bluePoints: game.bluePoints,
          prevInfo: "none",
          position: data.userType == "blueUser" ? false : true
        };
        if (++game.grailData.iter == 13) {
          game.grailData.iter = 0;
          game.grailData.wasGiven.forEach((val, i, arr) => (arr[i] = false));
          game.grailData.userType = "redUser";
          blueSocket.emit("grailNext", toEmit);
          redSocket.emit("grailNext", toEmit);
        } else {
          blueSocket.emit("grailUpdate", toEmit);
          redSocket.emit("grailUpdate", toEmit);
        }
      }
    }
    game.signal();
  });
}

module.exports = { grailSetup };
