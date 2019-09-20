const express = require("express");
const router = express.Router();
const { GoDModel, PlayerGoDModel } = require("../models/GoDModels");
const {
  AnagramModel,
  FivesModel,
  GrailModel,
  GameModel,
  GeoModel,
  MyNumModel
} = require("../models/GameModels");

const { Semaphore } = require("../socketControl/semaphore");

let godMutex = new Semaphore(1);

router.put("/set_god", async (req, res) => {
  if (req.body.date === undefined || req.body.game === undefined) {
    res.status(400).json("Nepotpun zahtev");
  } else {

  
   req.body.date = require('moment').utc(req.body.date);
   await GameModel.findById(req.body.game)
      .exec()
      .then(async doc => {
        if (doc == null) {
          res.status(400).json("Nevalidna igra");
        } else {
          await GoDModel.findOne({ date: req.body.date }).exec(
            async (err, doc) => {
              if (err) {
                console.log(err);
                res.status(500).json("Greska na serveru");
              } else {
                await godMutex.acquire();
                if (doc == null) {
                  let newGoD = new GoDModel(req.body);
                  await newGoD.save(async (err, doc) => {
                    if (err) {
                      console.log(err);
                      res.status(500).json("Greska na serveru");
                    } else {
                      res.status(200).json("Uspešan unos nove igre dana");
                    }
                  });
                } else {
                  await PlayerGoDModel.findOne({ GoD: doc._id }).exec(
                    async (_err, _doc) => {
                      if (_err) {
                        console.log(_err);
                        res.status(500).json("Greska na serveru");
                      } else if (_doc != null) {
                        res
                          .status(400)
                          .json(
                            "Nemoguće je ažurirati igru dana. Neko je već igrao"
                          );
                      } else {
                        doc.game = req.body.game;
                        await doc.save((err, doc) => {
                          if (err) {
                            console.log(err);
                            res.status(500).json("Greska na serveru");
                          } else {
                            res.status(200).json("Uspešno ažurirana igra dana");
                          }
                        });
                      }
                    }
                  );
                }
                godMutex.release();
              }
            }
          );
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

router.get("/all_gods", (req, res) => {
  GoDModel.find()
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/all_fives", (req, res) => {
  FivesModel.find()
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/all_grails", (req, res) => {
  GrailModel.find()
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/all_anagrams", (req, res) => {
  AnagramModel.find()
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/geo", (req, res) => {
  GeoModel.findOne()
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/my_num", (req, res) => {
  MyNumModel.findOne()
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/init_geonum", (req, res) => {
  let newGeo = new GeoModel();
  newGeo
    .save()
    .then(doc => {
      let newNum = new MyNumModel();
      newNum.save().then(doc => res.status(200).json("Uspeh"));
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
module.exports = router;
