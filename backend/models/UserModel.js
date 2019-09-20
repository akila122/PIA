const mongoose = require("mongoose");
const sha512 = require("js-sha512").sha512;
const Schema = mongoose.Schema;
const USER_TYPES = ["PLAYER", "SUPERVISOR", "ADMINISTRATOR"];

const UserSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  gender: {
    type: Boolean,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  profileImageURL: {
    type: String
  },
  autQuestion : {
    type : String,
    required : true,
  },
  autAnswer : {
    type : String,
    required : true,
  },
  userType: {
    type: String,
    enum: USER_TYPES,
    required: true
  },
  isActive: {
    type: Boolean
  },
  personalId: {
    type: String,
    required: true,
  },
  approvedBy: {
    type: String
  },
  profession: {
    type: String,
    required: true
  }
  
});

//ObjectId treated as Salt value
//Must be used as function(), Lambda doesn't work for some reason
// UserModelSchema.pre('save',function(next) {
//   this.password = sha512(this.password + this._id.valueOf());
//   this.autAnswer = sha512(this.autAnswer + this._id.valueOf());
//   this.personalId = sha512(this.personalId + this._id.valueOf());
//   next();
// });

module.exports = {
  USER_TYPES: USER_TYPES,
  UserModel: mongoose.model("User", UserSchema),
  UserSchema: UserSchema
};
