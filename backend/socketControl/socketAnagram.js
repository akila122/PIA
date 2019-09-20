let { sockets, games, socketsRW, gamesRW } = require("./data");
const { AnagramModel } = require("../models/GameModels");

function anagramSetup(socket) {
  socket.on("anagramLoaded", async gameId => {

    await gamesRW.startRead();
      let game = games[gameId];
    await gamesRW.endRead();
    await game.wait();
    if (game.anagramData == undefined) {
      let count = await AnagramModel.count().exec();
      let rnd1 = Math.floor(Math.random() * count);
      let rnd2 = Math.floor(Math.random() * count);
      while (rnd2 == rnd1) rnd2 = Math.floor(Math.random() * count);
      let a1 = await AnagramModel.findOne()
        .skip(rnd1)
        .exec();
      let a2 = await AnagramModel.findOne()
        .skip(rnd2)
        .exec();
      game.anagramData = {
        anagrams: {
          a1: a1,
          a2: a2
        },
        points:{
          bluePoints:0,
          redPoints:0
        }
      };
    }
    socket.emit("anagramData", game.anagramData);
    game.signal();
  });
  socket.on("anagramSync", async gameId => {
   
    await gamesRW.startRead();
      let game = games[gameId];
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username]
    let redSocket =  sockets[game.redUser.username]
    await socketsRW.endRead();

    await game.wait();
    if (game.anagramData.sync == undefined) {
      game.anagramData.sync = "ACK";
    } else {
      blueSocket.emit("anagramStart");
      redSocket.emit("anagramStart");
    }
    game.signal();
  });
  socket.on("sendTurn", async data => {

    await gamesRW.startRead();
      let game = games[gameId];
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username]
    let redSocket =  sockets[game.redUser.username]
    await socketsRW.endRead();

    let isBlue = data.username == game.blueUser.username;

    await game.wait();

    if (data.turn == 0) {
      if (game.anagramData.turnOne == undefined) {
        game.anagramData.turnOne = {
          blue: false,
          red: false
        };
        game.anagramData.turnOne[isBlue ? "blue" : "red"] =
          data.guess;
      } else {
        game.anagramData.turnOne[isBlue ? "blue" : "red"] =
          data.guess;
        let answers = game.anagramData.turnOne;
        if (answers.blue && answers.red) {
          game.bluePoints += 5;
          game.redPoints += 5;
          game.anagramData.points.redPoints += 5;
          game.anagramData.points.bluePoints += 5;
        } else if (!answers.blue && answers.red) {
          game.redPoints += 10;
          game.anagramData.points.redPoints += 10;
        } else if (answers.blue && !answers.red) {
          game.bluePoints += 10;
          game.anagramData.points.bluePoints += 10;
        }
        let toSend = {
          bluePoints: game.bluePoints,
          redPoints: game.redPoints
        };
        blueSocket.emit("anagramNext", toSend);
        redSocket.emit("anagramNext", toSend);
      }
    } else {
      if (game.anagramData.turnTwo == undefined) {
        game.anagramData.turnTwo = {
          blue: false,
          red: false
        };
        game.anagramData.turnTwo[isBlue ? "blue" : "red"] =
          data.guess;
      } else {
        game.anagramData.turnTwo[isBlue ? "blue" : "red"] =
          data.guess;
        let answers = game.anagramData.turnTwo;
        if (answers.blue && answers.red) {
          game.bluePoints += 5;
          game.redPoints += 5;
          game.anagramData.points.redPoints += 5;
          game.anagramData.points.bluePoints += 5;
        } else if (!answers.blue && answers.red) {
          game.redPoints += 10;
          game.anagramData.points.redPoints += 10;
        } else if (answers.blue && !answers.red) {
          game.bluePoints += 10;
          game.anagramData.points.bluePoints += 10;
        }
        let toSend = {
          bluePoints: game.bluePoints,
          redPoints: game.redPoints
        };
        blueSocket.emit("anagramNext", toSend);
        redSocket.emit("anagramNext", toSend);
      }
    }
    game.signal();
  });
}

module.exports = { anagramSetup };
