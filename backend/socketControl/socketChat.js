let { sockets, games, socketsRW, gamesRW } = require("./data");
let { FivesModel } = require("../models/GameModels");

function chatSetup(socket) {
  socket.on("sendMsg", async data => {
 
    await gamesRW.startRead();
    let game = games[data.gameId];
    let blueUser = game.blueUser.username;
    await gamesRW.endRead();
    await socketsRW.startRead();
    let blueSocket = sockets[game.blueUser.username];
    let redSocket = sockets[game.redUser.username];
    await socketsRW.endRead();

    redSocket.emit("newMsg", data);
    blueSocket.emit("newMsg",data);
  });
}

module.exports = { chatSetup };
