let { RW } = require("./readersWriters");
let gameRoom = [];
let sockets = {};
let games = {};
let geoRoom = [];

let gameRoomRW = new RW();
let socketsRW = new RW();
let gamesRW = new RW();
let geoRoomRW = new RW();

module.exports = {
  gameRoom,
  sockets,
  games,
  geoRoom,
  gameRoomRW,
  socketsRW,
  gamesRW,
  geoRoomRW
};
