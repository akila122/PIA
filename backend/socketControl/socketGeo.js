let {
  sockets,
  games,
  geoRoom,
  socketsRW,
  gamesRW,
  geoRoomRW
} = require("./data");
let { GeoAgrModel } = require("../models/GameModels");
let { Semaphore } = require("../socketControl/semaphore");

function getEmptyState() {
  return {
    Country: {
      answer: null,
      validInfo: "none",
      answerdBy: "none",
      pointsAdded: "0"
    },
    City: {
      answer: null,
      validInfo: "none",
      answerdBy: "none",
      pointsAdded: "0"
    },
    Lake: {
      answer: null,
      validInfo: "none",
      answerdBy: "none",
      pointsAdded: "0"
    },
    Mountain: {
      answer: null,
      validInfo: "none",
      answerdBy: "none",
      pointsAdded: "0"
    },
    River: {
      answer: null,
      validInfo: "none",
      answerdBy: "none",
      pointsAdded: "0"
    },
    Animal: {
      answer: null,
      validInfo: "none",
      answerdBy: "none",
      pointsAdded: "0"
    },
    Plant: {
      answer: null,
      validInfo: "none",
      answerdBy: "none",
      pointsAdded: "0"
    },
    Music: {
      answer: null,
      validInfo: "none",
      answerdBy: "none",
      pointsAdded: "0"
    }
  };
}

function geoSetup(socket, io) {
  socket.on("geoSoloNewGame", async user => {
    await socketsRW.startWrite();
    sockets[user.username] = socket;
    socket._user = user.username;
    socketsRW.endWrite();

    let game = {
      gameId: require("uuid/v4")(),
      solo: true,
      blueUser: user,
      bluePoints: 0,
      redPoints: 0,
      geoData: {
        geoEncaps: getEmptyState(),
        userType: "blueUser",
        points: {
          bluePoints: 0,
          redPoints: 0
        }
      },
      mutex: new Semaphore(1),
      wait: async function() {
        await this.mutex.acquire();
      },
      signal: function() {
        this.mutex.release();
      }
    };

    socket.gameId = game.gameId;

    await gamesRW.startWrite();
    games[game.gameId] = game;
    gamesRW.endWrite();

    setTimeout(async () => {
      await socketsRW.startRead();
      let blueSocket = sockets[game.blueUser.username];
      await socketsRW.endRead();
      await geoRoomRW.startWrite();
      geoRoom = geoRoom.filter(iter => iter.gameId != game.gameId);
      geoRoomRW.endWrite();
      await game.wait();
      if (!game.supervisor) {
        game.supervisor = "TIMEOUT";
        io.to("geoRoom").emit("geoGameTaken", { gameId: game.gameId });
        blueSocket.emit("geoSupervSync", { err: true, gameId: game.gameId });
      }
      game.signal();
    }, 30000);

    await geoRoomRW.startWrite();
    geoRoom.push(game);
    geoRoomRW.endWrite();
    io.to("geoRoom").emit("newGeo", game);
  });

  socket.on("geoSupervJoin", async user => {
    await socketsRW.startWrite();

    sockets[user.username] = socket;

    socketsRW.endWrite();

    socket._user = user.username;

    socket.join("geoRoom");

    await geoRoomRW.startRead();

    socket.emit("geoRoomGames", geoRoom);

    await geoRoomRW.endRead();
  });
  socket.on("geoChosen", async data => {
    await gamesRW.startRead();
    let game = games[data.gameId];
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username];
    let redSocket = game.solo ? null : sockets[game.redUser.username];
    await socketsRW.endRead();
    await geoRoomRW.startWrite();
    geoRoom = geoRoom.filter(iter => iter.gameId != data.gameId);
    geoRoomRW.endWrite();
    await game.wait();
    game.supervisor = data.supervisor;
    socket.gameId = data.gameId;
    socket.to("geoRoom").emit("geoGameTaken", data);
    socket.leave("geoRoom");
    blueSocket.emit("geoSupervSync", data);
    if (!game.solo) redSocket.emit("geoSupervSync", data);
    game.signal();
  });

  socket.on("geoComponentLoaded", async gameId => {
    await gamesRW.startRead();
    let game = games[gameId];
    await gamesRW.endRead();

    await game.wait();

    if (game.geoData == undefined) {
      let abc = [
        "a",
        "b",
        "c",
        "č",
        "ć",
        "d",
        "dž",
        "đ",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "lj",
        "m",
        "n",
        "o",
        "p",
        "r",
        "s",
        "š",
        "t",
        "u",
        "v",
        "z",
        "ž"
      ];

      let c1 = abc[Math.floor(abc.length * Math.random())];
      let c2 = abc[Math.floor(abc.length * Math.random())];
      while (c1 == c2) c2 = abc[Math.floor(abc.length * Math.random())];
      game.geoData = {
        c1: c1,
        c2: c2,
        geoEncaps: getEmptyState(),
        userType: "redUser",
        points: {
          bluePoints: 0,
          redPoints: 0
        }
      };
    }
    socket.emit("geoData", game.geoData);
    game.signal();
  });

  socket.on("geoDataLoaded", async gameId => {
    await gamesRW.startRead();
    let game = games[gameId];
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username];
    let redSocket = sockets[game.redUser.username];
    await socketsRW.endRead();

    await game.wait();
    if (game.geoData.sync == undefined) {
      game.geoData.sync = "ACK";
    } else {
      blueSocket.emit("geoGameBegin");
      redSocket.emit("geoGameBegin");
      await geoRoomRW.startWrite();
      geoRoom.push(game);
      geoRoomRW.endWrite();
      io.to("geoRoom").emit("newGeo", game);

      setTimeout(async () => {
        await gamesRW.startRead();
        let game = games[gameId];
        await gamesRW.endRead();
        await socketsRW.startRead();
        let blueSocket = sockets[game.blueUser.username];
        let redSocket = sockets[game.redUser.username];
        await socketsRW.endRead();
        await geoRoomRW.startWrite();
        geoRoom = geoRoom.filter(iter => iter.gameId != gameId);
        geoRoomRW.endWrite();
        await game.wait();
        if (!game.supervisor) {
          game.supervisor = "TIMEOUT";
          io.to("geoRoom").emit("geoGameTaken", { gameId: gameId });
          blueSocket.emit("geoSupervSync", "TIMEOUT");
          redSocket.emit("geoSupervSync", "TIMEOUT");
        }
        game.signal();
      }, 30000);
    }
    game.signal();
  });

  socket.on("geoPlayerSendData", async playerSent => {
    await gamesRW.startRead();
    let game = games[playerSent.gameId];
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username];
    let redSocket = game.solo ? null : sockets[game.redUser.username];
    let supervSocket =
      game.supervisor === "TIMEOUT" ? null : sockets[game.supervisor.username];
    await socketsRW.endRead();

    await game.wait();

    let sendToSuperv = [];

    if (playerSent.myTurn) game.geoData.userType = playerSent.userType;

    for (answer of playerSent.answers) {
      if (answer.answer != null) {
        let doc = await GeoAgrModel.findOne({
          kind: answer.kind,
          data: answer.answer
        }).exec();

        if (doc != null) {
          game[
            playerSent.userType == "redUser" ? "redPoints" : "bluePoints"
          ] += playerSent.myTurn ? 2 : 3;
          game.geoData.points[
            playerSent.userType == "redUser" ? "redPoints" : "bluePoints"
          ] += playerSent.myTurn ? 2 : 3;
          game.geoData.geoEncaps[answer.kind].answer = answer.answer;
          game.geoData.geoEncaps[answer.kind].answerdBy = playerSent.userType;
          game.geoData.geoEncaps[answer.kind].validInfo = "auto";
          game.geoData.geoEncaps[answer.kind].pointsAdded = playerSent.myTurn
            ? "+2"
            : "+3";
        } else {
          sendToSuperv.push(answer);
        }
      }
    }

    //If something needs to be validated, Supervisor should validate it

    if (supervSocket != null && sendToSuperv.length > 0) {
      supervSocket.emit("geoValidate", {
        answers: sendToSuperv,
        gameId: game.gameId,
        userType: playerSent.userType,
        myTurn: playerSent.myTurn
      });

      //If there is nothing to validate
      //Either evrything was automaticly validated or there are some non answerd
    } else {
      //If evrything was automaticly validated its ending turn
      if (
        Object.keys(game.geoData.geoEncaps).filter(
          key => game.geoData.geoEncaps[key].answer == null
        ).length == 0
      ) {
        let resultsInfo = [];
        Object.keys(game.geoData.geoEncaps).forEach(key => {
          resultsInfo.push({
            kind: key,
            answer: game.geoData.geoEncaps[key].answer,
            answerdBy: game.geoData.geoEncaps[key].answerdBy,
            validInfo: game.geoData.geoEncaps[key].validInfo,
            pointsAdded: game.geoData.geoEncaps[key].pointsAdded
          });
        });
        toEmit = {
          redPoints: game.redPoints,
          bluePoints: game.bluePoints,
          resultsInfo: resultsInfo
        };

        game.geoData.geoEncaps = getEmptyState();
        game.geoData.userType = "blueUser";

        blueSocket.emit("geoNextTurn", toEmit);
        if (redSocket != null) redSocket.emit("geoNextTurn", toEmit);
        if (supervSocket != null) supervSocket.emit("geoNextTurn", toEmit);
      } else {
        //If there are some empty fields give it to Oponnent

        if (playerSent.myTurn && !game.solo) {
          sendToSocket =
            playerSent.userType == "blueUser" ? redSocket : blueSocket;
          let toGuess = [];
          Object.keys(game.geoData.geoEncaps).forEach(key => {
            if (game.geoData.geoEncaps[key].answer == null)
              toGuess.push({
                kind: key,
                answer: ""
              });
          });
          sendToSocket.emit("geoAnswerOps", toGuess);
        } else {
          //If there are some empty fields that Oponnent gave its ending turn

          let resultsInfo = [];
          Object.keys(game.geoData.geoEncaps).forEach(key => {
            resultsInfo.push({
              kind: key,
              answer: game.geoData.geoEncaps[key].answer,
              answerdBy: game.geoData.geoEncaps[key].answerdBy,
              validInfo: game.geoData.geoEncaps[key].validInfo,
              pointsAdded: game.geoData.geoEncaps[key].pointsAdded
            });
          });
          toEmit = {
            redPoints: game.redPoints,
            bluePoints: game.bluePoints,
            resultsInfo: resultsInfo
          };

          game.geoData.geoEncaps = getEmptyState();
          game.geoData.userType = "blueUser";

          blueSocket.emit("geoNextTurn", toEmit);
          if (redSocket != null) redSocket.emit("geoNextTurn", toEmit);
          if (supervSocket != null) supervSocket.emit("geoNextTurn", toEmit);
        }
      }
    }
    game.signal();
  });

  socket.on("geoDataValidated", async supervisorSent => {
    await gamesRW.startRead();
    let game = games[supervisorSent.gameId];
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username];
    let redSocket = game.solo ? null : sockets[game.redUser.username];
    let supervSocket = sockets[game.supervisor.username];
    await socketsRW.endRead();

    await game.wait();

    supervisorSent.answers.forEach(answer => {
      if (answer.answer != null) {
        GeoAgrModel.create({
          kind: answer.kind,
          data: answer.answer
        });

        game[
          supervisorSent.userType == "redUser" ? "redPoints" : "bluePoints"
        ] += supervisorSent.myTurn ? 4 : 5;
        game.geoData.points[
          supervisorSent.userType == "redUser" ? "redPoints" : "bluePoints"
        ] += supervisorSent.myTurn ? 4 : 5;

        game.geoData.geoEncaps[answer.kind].answer = answer.answer;
        game.geoData.geoEncaps[answer.kind].answerdBy = supervisorSent.userType;
        game.geoData.geoEncaps[answer.kind].validInfo = "superv";
        game.geoData.geoEncaps[answer.kind].pointsAdded = supervisorSent.myTurn
          ? "+4"
          : "+5";
      }
    });
    //If evrything was validated its ending turn
    if (
      Object.keys(game.geoData.geoEncaps).filter(
        key => game.geoData.geoEncaps[key].answer == null
      ).length == 0
    ) {
      let resultsInfo = [];
      Object.keys(game.geoData.geoEncaps).forEach(key => {
        resultsInfo.push({
          kind: key,
          answer: game.geoData.geoEncaps[key].answer,
          answerdBy: game.geoData.geoEncaps[key].answerdBy,
          validInfo: game.geoData.geoEncaps[key].validInfo,
          pointsAdded: game.geoData.geoEncaps[key].pointsAdded
        });
      });
      toEmit = {
        redPoints: game.redPoints,
        bluePoints: game.bluePoints,
        resultsInfo: resultsInfo
      };

      game.geoData.geoEncaps = getEmptyState();
      game.geoData.userType = "blueUser";

      blueSocket.emit("geoNextTurn", toEmit);
      if (redSocket != null) redSocket.emit("geoNextTurn", toEmit);
      supervSocket.emit("geoNextTurn", toEmit);
    } else {
      //If there are some empty fields give it to Oponnent

      if (supervisorSent.myTurn && !game.solo) {
        sendToSocket =
          supervisorSent.userType == "blueUser" ? redSocket : blueSocket;
        let toGuess = [];
        Object.keys(game.geoData.geoEncaps).forEach(key => {
          if (game.geoData.geoEncaps[key].answer == null)
            toGuess.push({
              kind: key,
              answer: ""
            });
        });
        sendToSocket.emit("geoAnswerOps", toGuess);
      } else {
        //If there are some empty fields that Oponnent gave its ending turn

        let resultsInfo = [];
        Object.keys(game.geoData.geoEncaps).forEach(key => {
          resultsInfo.push({
            kind: key,
            answer: game.geoData.geoEncaps[key].answer,
            answerdBy: game.geoData.geoEncaps[key].answerdBy,
            validInfo: game.geoData.geoEncaps[key].validInfo,
            pointsAdded: game.geoData.geoEncaps[key].pointsAdded
          });
        });
        toEmit = {
          redPoints: game.redPoints,
          bluePoints: game.bluePoints,
          resultsInfo: resultsInfo
        };

        game.geoData.geoEncaps = getEmptyState();
        game.geoData.userType = "blueUser";

        blueSocket.emit("geoNextTurn", toEmit);
        if (redSocket != null) redSocket.emit("geoNextTurn", toEmit);
        supervSocket.emit("geoNextTurn", toEmit);
      }
    }

    game.signal();
  });

  socket.on("geoGameEnd", async supervisor => {
    await socketsRW.startRead();
    let supervSocket = sockets[supervisor.username];
    await socketsRW.endRead();
    await gamesRW.startRead();
    let game = games[socket.gameId];
    await gamesRW.endRead();
    delete game.supervisor;
    delete supervSocket.gameId;
    supervSocket.emit("geoGameEnd");
  });
}

module.exports = { geoSetup };
