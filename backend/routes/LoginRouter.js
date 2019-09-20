const express = require("express");
const { UserModel } = require("../models/UserModel");
const router = express.Router();
const sha512 = require("js-sha512").sha512;


function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}

router.post("/", async (req, res) => {
  if (req.body.username === undefined || req.body.password === undefined) {
    res.status(400).json("Nepotpun zahtev");
  } else {

    await UserModel.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
        console.log(err);
        res.status(500).json("Greška na serveru");
      } else {
        if (user === null) {
          res.status(404).json("Nevažeće korisničko ime");
        } else if (user.approvedBy === undefined) {
          res.status(401).json("Nalog još nije verifikovan od strane administratora");
        } else if (
          user.password !== sha512(req.body.password + user._id.valueOf())
        ) {
          res.status(401).json("Netačna lozinka");
        } else {
          user._id = null;
          user.password = null;
          user.autAnswer = null;
          user.personalId = null;
          res.status(200).json(user.toObject());
        }
      }
    });
  }
});

router.post("/change_pass", async (req, res) => {
  if (req.body.username === undefined || req.body.personalId === undefined) {
    res.status(400).json("Nepotpun zahtev");
  } else {
    await UserModel.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
        console.log(err);
        res.status(500).json("Greška na serveru");
      } else {
        if (user === null) {
          res.status(404).json("Nevažeće korisničko ime");
        } else if (
          user.personalId !== sha512(req.body.personalId + user._id.valueOf())
        ) {
          res.status(401).json("Nevažeći JMBG");
        } else {
          user._id = null;
          user.password = null;
          user.autAnswer = null;
          user.personalId = null;
          res.status(200).json(user.toObject());
        }
      }
    });
  }
});

router.post("/aut_question", async (req, res) => {
  if (
    req.body.username === undefined ||
    req.body.autAnswer === undefined
  ) {
    res.status(400).json("Nepotpun zahtev");
  } else {
    await UserModel.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
        console.log(err);
        res.status(500).json("Greška na serveru");
      } else {
        if (user === null) {
          res.status(404).json("Nevažeće korisničko ime");
        } else if (
          user.autAnswer !== sha512(req.body.autAnswer + user._id.valueOf())
        ) {
          res.status(401).json("Nevažeći odgovor");
        } else {

          user._id = null;
          user.password = null;
          user.autAnswer = null;
          user.personalId = null;
          res.status(200).json(user.toObject());
        }
      }
    });
  }
});

router.post("/reset_password", async (req, res) => {
  if (
    req.body.username === undefined ||
    req.body.password === undefined ||
    req.body.newPassword === undefined
  ) {
    res.status(400).json("Nepotpun zahtev");
  } else {
    await UserModel.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
        console.log(err);
        res.status(500).json("Greška na serveru");
      } else {
        if (user === null) {
          res.status(404).json("Nevažeće korisničko ime");
        } else if (
          user.password !==
            sha512(req.body.password + user._id.valueOf())
        ) {
          res.status(401).json("Pogrešna lozinka");
        } else {
          user.password = sha512(req.body.newPassword + user._id.valueOf());
          user
            .save()
            .then(user => res.status(200).json("Uspešno ste promenili lozinku"))
            .catch(err => {
              console.log(err);
              res.status(500).json("Greška na serveru");
            });
        }
      }
    });
  }
});


router.post("/change_pass_fully", async (req, res) => {
  if (
    req.body.username === undefined ||
    req.body.password === undefined ||
    req.body.autAnswer === undefined ||
    req.body.personalId === undefined
  ) {
    res.status(400).json("Nepotpun zahtev");
  } else {
    await UserModel.findOne({ username: req.body.username }, async (err, user) => {
      if (err) {
        console.log(err);
        res.status(500).json("Greška na serveru");
      } else {
        if (user === null) {
          res.status(404).json("Nevažeće korisničko ime");
        } else if (
          user.personalId !==
            sha512(req.body.personalId + user._id.valueOf()) ||
          user.autAnswer !== sha512(req.body.autAnswer + user._id.valueOf())
        ) {
          res.status(401).json("Nevažeći odgovor");
        } else {
          user.password = sha512(req.body.password + user._id.valueOf());
          await user
            .save()
            .then(user => res.status(200).json("Uspešno ste promenili lozinku"))
            .catch(err => {
              console.log(err);
              res.status(500).json("Greška na serveru");
            });
        }
      }
    });
  }
});

module.exports = router;
