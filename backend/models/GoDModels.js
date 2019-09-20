const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GoDSchema = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
    required: true
  }
});

const PlayerGoDSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  GoD: {
    type: Schema.Types.ObjectId,
    ref: "GoD",
    required: true
  },
  points: {
    type: Number
  }
});

module.exports = {
  GoDModel: mongoose.model("GoD", GoDSchema),
  PlayerGoDModel: mongoose.model("PlayerGoD", PlayerGoDSchema)
};
