let { sockets, games, socketsRW, gamesRW } = require("./data");
let { FivesModel } = require("../models/GameModels");

function fivesSetup(socket) {
  socket.on("fivesComponentLoaded", async gameId => {
    await gamesRW.startRead();
    let game = games[gameId];
    await gamesRW.endRead();

    await game.wait();
    if (game.fivesData == undefined) {
      let count = await FivesModel.count().exec();
      let rnd = Math.floor(Math.random() * count);
      let f = await FivesModel.findOne()
        .skip(rnd)
        .exec();
      cStart = f.data[Math.floor(Math.random() * 5)].charAt(
        Math.floor(Math.random() * 5)
      );
      game.fivesData = {
        fives: f,
        redPoints: 0,
        bluePoints: 0,
        cnt: 0,
        points: {
          bluePoints: 0,
          redPoints: 0
        }
      };
    }
    socket.emit("fivesData", {
      data: game.fivesData.fives,
      cStart: cStart
    });
    game.signal();
  });
  socket.on("fivesDataLoaded", async gameId => {
    await gamesRW.startRead();
    let game = games[gameId];
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username];
    let redSocket = sockets[game.redUser.username];
    await socketsRW.endRead();

    await game.wait();
    if (game.fivesData.sync == undefined) {
      game.fivesData.sync = "ACK";
    } else {
      blueSocket.emit("fivesGameBegin");
      redSocket.emit("fivesGameBegin");
    }
    game.signal();
  });

  socket.on("fivesNextTurn", async data => {
    let isBlue = data.userType == "blueUser";

    await gamesRW.startRead();
    let game = games[data.gameId];
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username];
    let redSocket = sockets[game.redUser.username];
    await socketsRW.endRead();

    game[isBlue ? "bluePoints" : "redPoints"] += data.points;
    game.fivesData[isBlue ? "bluePoints" : "redPoints"] += data.points;
    game.fivesData.points[isBlue ? "bluePoints" : "redPoints"] += data.points;
    if (++game.fivesData.cnt == 30) {
      redSocket.emit("fivesGameEnded", "LIMIT_REACHED");
      blueSocket.emit("fivesGameEnded", "LIMIT_REACHED");
    } else {
      sendTo = isBlue ? redSocket : blueSocket;
      sendTo.emit("fivesTakeTurn", data);
    }
  });
  socket.on("fivesGameFinish", async data => {
    let isBlue = data.userType == "blueUser";

    await gamesRW.startRead();
    let game = games[data.gameId];
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username];
    let redSocket = sockets[game.redUser.username];
    await socketsRW.endRead();

    game[isBlue ? "bluePoints" : "redPoints"] += data.points;
    game.fivesData[isBlue ? "bluePoints" : "redPoints"] += data.points;
    game.fivesData.points[isBlue ? "bluePoints" : "redPoints"] += data.points;
    (isBlue ? redSocket : blueSocket).emit("fivesGameEnded", data);
  });
}

module.exports = { fivesSetup };
