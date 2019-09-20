const { gameRoomSetup } = require("./socketRoom");
const { anagramSetup } = require("./socketAnagram");
const { myNumSetup } = require("./socketMyNum");
const { fivesSetup } = require("./socketFives");
const { geoSetup } = require("./socketGeo");
const { grailSetup } = require("./socketGrail");
const { resultsSetup } = require("./socketResults");
const { chartsSetup } = require("./socketCharts");
const { godSetup } = require("./socketGod");
const { chatSetup } = require("./socketChat");
let { sockets, games, socketsRW, gamesRW } = require("./data");

function setupSocket(io) {
  io.on("connection", socket => {
    gameRoomSetup(socket);
    anagramSetup(socket);
    myNumSetup(socket);
    fivesSetup(socket);
    geoSetup(socket, io);
    grailSetup(socket);
    resultsSetup(socket);
    chartsSetup(socket);
    godSetup(socket);
    chatSetup(socket);
    socket.on("disconnect", async () => {
      if (socket._user) {
        if (socket.gameId) {
          await gamesRW.startRead();
          let game = games[socket.gameId];
          delete sockets[socket._user];
          await gamesRW.endRead();
          await socketsRW.startRead();
          let blueSocket = sockets[game.blueUser.username];
          let redSocket = game.redUser ? sockets[game.redUser.username] : null;
          let supervSocket = game.supervisor
            ? sockets[game.supervisor.username]
            : null;
          await socketsRW.endRead();

          await gamesRW.startWrite();
          delete games[socket.gameId];
          gamesRW.endWrite();

          if (blueSocket) {
            blueSocket.emit("gameStop");
            delete blueSocket.gameId;
          }

          if (redSocket) {
            redSocket.emit("gameStop");
            delete redSocket.gameId;
          }

          if (supervSocket) {
            supervSocket.emit("gameStop");
            delete supervSocket.gameId;
          }
        } else delete sockets[socket._user];
      }
    });
  });
}

module.exports = { setupSocket };
