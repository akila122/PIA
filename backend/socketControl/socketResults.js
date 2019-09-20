let { sockets, games, socketsRW, gamesRW } = require("./data");
const { DuelModel } = require("../models/MatchModel");
const { UserModel } = require("../models/UserModel");

function resultsSetup(socket) {
  socket.on("getResults", async gameId => {
    await gamesRW.startRead();
    let game = games[gameId];
    await gamesRW.endRead();

    await game.wait();

    if (game.results == undefined) {
      points = [];

      points.push(game.anagramData.points);
      points.push(game.myNumData.points);
      points.push(game.fivesData.points);
      points.push(game.geoData.points);
      points.push(game.grailData.points);

      blueUser = await UserModel.findOne({
        username: game.blueUser.username
      }).exec();
      redUser = await UserModel.findOne({
        username: game.redUser.username
      }).exec();

      game.results = {};
      game.results.points = points;
      game.results.total = {
        redPoints: game.redPoints,
        bluePoints: game.bluePoints
      };
      DuelModel.create({
        blueUser: blueUser._id,
        redUser: redUser._id,
        bluePoints: game.bluePoints,
        redPoints: game.redPoints,
        points: points,
        date: new Date().toISOString().split("T")[0]
      });
    } else {
      await socketsRW.startRead();
      let blueSocket = sockets[game.blueUser.username];
      let redSocket = sockets[game.redUser.username];
      await socketsRW.endRead();

      await gamesRW.startWrite();

      delete games[gameId];

      gamesRW.endWrite();
      delete blueSocket.gameId;
      delete redSocket.gameId;
    }
    socket.emit("gameResults", game.results);
    game.signal();
  });
}

module.exports = { resultsSetup };
