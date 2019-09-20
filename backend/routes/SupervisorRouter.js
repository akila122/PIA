const express = require("express");
const router = express.Router();
const {
  AnagramModel,
  FivesModel,
  GrailModel
} = require("../models/GameModels");

const { UserModel } = require("../models/UserModel");
const { DuelModel } = require("../models/MatchModel");

router.put("/add_anagram", (req, res) => {
  if (!isAnagram(req.body.data.question, req.body.data.answer)) {
    res.status(400).json("Poslat podatak nije anagram");
    return;
  }
  let newAnagram = new AnagramModel(req.body);
  newAnagram
    .save()
    .then(doc => res.status(200).json("Uspeh"))
    .catch(err => {
      console.log(err);
      res.status(500).json("Greska na serveru");
    });
});
router.put("/add_fives", (req, res) => {
  if (!isFives(req.body.data)) {
    res.status(400).json("Poslat podatak nije 5x5");
    return;
  }
  let newFives = new FivesModel(req.body);
  newFives
    .save()
    .then(doc => res.status(200).json("Uspeh"))
    .catch(err => {
      console.log(err);
      res.status(500).json("Greska na serveru");
    });
});

router.put("/seed_games", async (req, res) => {
  let users = await UserModel.find({ userType: "PLAYER" }).exec();

  for (let i = 0; i < 1000; i++) {
    let rnd1 = Math.floor(users.length * Math.random());
    let rnd2 = Math.floor(users.length * Math.random());
    while (rnd2 == rnd1) rnd2 = Math.floor(users.length * Math.random());

    let toDate = new Date();
    let fromDate = new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    let rndDate = new Date(
      toDate.getTime() +
        Math.floor((fromDate.getTime() - toDate.getTime()) * Math.random())
    );

    await DuelModel.create({
      blueUser: users[rnd1]._id,
      redUser: users[rnd2]._id,
      bluePoints: Math.floor(60 + 40 * Math.random()),
      redPoints: Math.floor(60 + 40 * Math.random()),
      points: "DUMMY",
      date: rndDate.toISOString().split("T")[0]
    });
  }

  

  res.json("END");
});

router.get("/top_month", async (req, res) => {
  let date = new Date();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  end = date.toISOString().split("T")[0];
  start = firstDay.toISOString().split("T")[0];

  let docs = await DuelModel.find({ date: { $gte: start, $lte: end } }).exec();

  let toReturn = {};

  for (let doc of docs) {
    if (toReturn[doc.blueUser] == undefined) {
      toReturn[doc.blueUser] = doc.bluePoints;
    } else {
      toReturn[doc.blueUser] += doc.bluePoints;
    }
    if (toReturn[doc.redUser] == undefined) {
      toReturn[doc.redUser] = doc.redPoints;
    } else {
      toReturn[doc.redUser] += doc.redPoints;
    }
  }

  let toArray = [];

  for (user in toReturn) {
    toArray.push({
      user: user,
      points: toReturn[user]
    });
  }

  toArray = toArray.sort((a, b) => -(a.points - b.points));

  for (x of toArray) {
    let user = await UserModel.findById(x.user).exec();
    user._id = null;
    user.password = null;
    user.autAnswer = null;
    user.personalId = null;
    x.user = user;
  }

  res.json(toArray);
});

router.put("/add_grail", (req, res) => {
  let toTest = [];

  for (x of req.body.data) toTest.push(x.answer);

  if (!isGrail(toTest)) {
    res.status(400).json("Poslat podatak nije pehar");
    return;
  }

  let newGrail = new GrailModel(req.body);
  newGrail
    .save()
    .then(doc => res.status(200).json("Uspeh"))
    .catch(err => {
      console.log(err);
      res.status(500).json("Greska na serveru");
    });
});

function isAnagram(s1, s2) {
  s1 = s1
    .toLowerCase()
    .split("")
    .filter(c => c != " " && c != "," && c != "." && c != "!" && c != "?")
    .sort()
    .join("");
  s2 = s2
    .toLowerCase()
    .split("")
    .filter(c => c != " " && c != "," && c != "." && c != "!" && c != "?")
    .sort()
    .join("");

  if (s1 != s2) return false;
  else return true;
}

function isFives(toTest) {
  if (toTest.length != 5) return false;
  for (str of toTest) {
    if (str.length != 5) return false;
  }
  return true;
}

function isGrail(toTest) {
  if (toTest.length != 13) return false;

  function diffByOne(s1, s2) {
    if (s1.length - s2.length != 1) return false;

    s1 = s1
      .toLowerCase()
      .split("")
      .sort();
    s2 = s2
      .toLowerCase()
      .split("")
      .sort();

    for (c2 of s2) {
      isThere = false;
      for (c1 of s1) {
        if (c1 == c2) {
          isThere = true;
          break;
        }
      }
      if (!isThere) {
        return false;
      }
    }
    return true;
  }

  for (i = 0; i < 6; i++)
    if (!diffByOne(toTest[i], toTest[i + 1])) return false;
  for (i = 12; i > 6; i--)
    if (!diffByOne(toTest[i], toTest[i - 1])) return false;

  return true;
}

module.exports = router;
