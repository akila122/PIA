let { gameRoom, sockets, games, gameRoomRW,socketsRW,gamesRW } = require("./data");
let { Semaphore } = require("./semaphore");

function gameRoomSetup(socket) {
  socket.on("leaveRoom", async user => {
    await gameRoomRW.startWrite();
    gameRoom = gameRoom.filter(iter => iter.username != user.username);
    gameRoomRW.endWrite();
    socket.leave("gameRoom");
    socket.to("gameRoom").emit("gameCancled", user);
  });
  socket.on("joinRoom", async user => {
    await socketsRW.startWrite();
    sockets[user.username] = socket;
    socket._user = user.username;
    socket.join("gameRoom");
    socket.emit("allGames", gameRoom);
    socketsRW.endWrite();
    
  });
  socket.on("addGame", async user => {
    await gameRoomRW.startWrite();
    gameRoom.push(user);
    gameRoomRW.endWrite();
    socket.to("gameRoom").emit("newGame", user);
  });
  socket.on("cancleGame", async user => {
    await gameRoomRW.startWrite();
    gameRoom = gameRoom.filter(iter => iter.username != user.username);
    gameRoomRW.endWrite();
    socket.to("gameRoom").emit("gameCancled", user);
  });

  socket.on("redStarted", async data => {
    blueUser = data.blueUser;
    redUser = data.redUser;
    gameId = require("uuid/v4")();
    await gamesRW.startWrite();
    games[gameId] = {
      blueUser: blueUser,
      redUser: redUser,
      gameId: gameId,
      redPoints: 0,
      bluePoints: 0,
      mutex: new Semaphore(1),
      wait: async function() {
        await this.mutex.acquire();
      },
      signal: function() {
        this.mutex.release();
      }
    };
    game = games[gameId];
    gamesRW.endWrite();
    await socketsRW.startRead();
    sockets[blueUser.username].gameId = gameId;
    socket.gameId = gameId;
    sockets[blueUser.username].emit("startGame", game);
    await socketsRW.endRead();
    socket.emit("startGame", game);
  });
}

module.exports = { gameRoomSetup };
