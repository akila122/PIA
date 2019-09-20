const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DuelSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  date: {
    type: Date,
    required: true
  },
  blueUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  redUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bluePoints: {
    type: Number,
    required: true
  },
  redPoints: {
    type: Number,
    required: true
  },
  points: {
    type: Schema.Types.Mixed,
    required: true
  }
});

module.exports = {
  DuelModel: mongoose.model("Duel", DuelSchema)
};
