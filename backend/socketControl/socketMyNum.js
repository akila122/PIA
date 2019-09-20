let { sockets, games, socketsRW, gamesRW } = require("./data");

function myNumSetup(socket) {
  socket.on("myNumLoaded", async gameId => {
    await gamesRW.startRead();
    let game = games[gameId];
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username];
    let redSocket = sockets[game.redUser.username];
    await socketsRW.endRead();

    await game.wait();

    if (game.myNumData == undefined) {
      game.myNumData = {
        blueUser: [],
        redUser: [],
        points:{
          bluePoints:0,
          redPoints:0
        }
      };
    } else {
      blueSocket.emit("myNumSync");
      redSocket.emit("myNumSync");
    }
    game.signal();
  });

  socket.on("myNumSetNumClient", async data => {
    await socketsRW.startRead();
    let _socket = sockets[games[data.gameId][data.userType].username];
    await socketsRW.endRead();
    _socket.emit("myNumSetNumServer", { val: data.val, i: data.i });
  });

  socket.on("gameBegin", async data => {

    await socketsRW.startRead();
    let _socket = sockets[games[data.gameId][data.userType].username];
    await socketsRW.endRead();

    _socket.emit(
      "myNumAllSet",
      null
    );
  });

  socket.on("computeDone", async data => {

    await gamesRW.startRead();
    let game = games[data.gameId];
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username];
    let redSocket = sockets[game.redUser.username];
    await socketsRW.endRead();

    await game.wait();
    game.myNumData[data.userType][data.turn] = {
      compute: data.compute,
      answer: data.answer,
      sub: data.sub
    };
    if (
      game.myNumData.blueUser.length ==
      game.myNumData.redUser.length
    ) {
      let numBlue = game.myNumData.blueUser[data.turn].compute;
      let numRed = game.myNumData.redUser[data.turn].compute;
      let subBlue = game.myNumData.blueUser[data.turn].sub;
      let subRed = game.myNumData.redUser[data.turn].sub;

      let addBlue = 0;
      let addRed = 0;

      if (numBlue == null && numRed != null) addRed = 10;
      else if (numBlue != null && numRed == null) addBlue = 10;
      else if (numBlue != null && numRed != null) {
        if (subBlue < subRed) addBlue = 10;
        else if (subBlue > subRed) addRed = 10;
        else {
          addRed = 5;
          addBlue = 5;
        }
      }

      game.redPoints += addRed;
      game.bluePoints += addBlue;

      game.myNumData.points.redPoints += addRed;
      game.myNumData.points.bluePoints += addBlue;

      let sendBlue = {
        bluePoints: game.bluePoints,
        redPoints: game.redPoints,
        answer: game.myNumData.redUser[data.turn].answer,
        compute: game.myNumData.redUser[data.turn].compute
      };
      let sendRed = {
        bluePoints: game.bluePoints,
        redPoints: game.redPoints,
        answer: game.myNumData.blueUser[data.turn].answer,
        compute: game.myNumData.blueUser[data.turn].compute
      };
      blueSocket.emit(
        "myNumNextTurn",
        sendBlue
      );
      redSocket.emit(
        "myNumNextTurn",
        sendRed
      );
    }
    game.signal();
  });
}

module.exports = { myNumSetup };
