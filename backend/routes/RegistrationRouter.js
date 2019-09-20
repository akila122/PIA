const express = require("express");
const { UserModel } = require("../models/UserModel");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const nodemailer = require('nodemailer');
const sha512 = require("js-sha512").sha512;
const resizeX = 300,
  resizeY = 300;

const upload = multer({
  dest: "/uploads"
});

//User creation
router.post("/register_user", upload.single("profileImg"), async (req, res) => {
  let newUser = new UserModel(JSON.parse(req.body.user));
  await newUser
    .save()
    .then(document => {

      document.password = sha512(document.password + document._id.valueOf());
      document.personalId = sha512(document.personalId + document._id.valueOf());
      document.autAnswer = sha512(document.autAnswer + document._id.valueOf());

      const tempPath = req.file.path;
      const targetPath = path.join(
        __dirname,
        "../uploads/" +
          document.username +
          path.extname(req.file.originalname).toLowerCase()
      );
      document.profileImageURL =
        req.protocol +
        "://" +
        req.get("host") +
        "/uploads/" +
        document.username +
        path.extname(req.file.originalname).toLowerCase();
      document.save();
      sharp(tempPath)
        .resize({ width: resizeX, height: resizeY })
        .toFile(targetPath)
        .then(newFileInfo =>
          res.status(200).json("Uspešno ste priložili registracionu formu")
        );
    })
    .catch(error => {
      res.status(500).json(error);
      console.log(error);
    });
});
//User 
router.put("/approve_user", async (req, res) => {
  if (
    req.body.user === undefined ||
    req.body.admin === undefined ||
    req.body.approve === undefined
  ){
    res.status(400).json("Parameters missing");
  }
    else {
    await UserModel.findOne({ username: req.body.user }).exec( async (err, user) => {
      if (err) {
        res.status(500).json(err);
        console.log(err);
      } else if (user === null) {
        res.status(400).json("User not found");
      } else if (req.body.approve) {
        user.approvedBy = req.body.admin;
        await user.save();
        res.status(200).json("User accepted");
        sendMail(user.email,"Verifikacija naloga","Vas nalog za KviskotekaETF aplikaciju je prihvacen.")
      } else {
        await UserModel.deleteOne({ username: req.body.user }, err => {
          if (err) {
            res.status(500).json(err);
            console.log(err);
          }
          res.status(200).json("User declined");
          fs.unlink(/^.*(uploads\/.*\..*)$/.exec(user.profileImageURL)[1], err => {
            if (err) console.log(err);
          });
          sendMail(user.email,"Verifikacija naloga","Vas nalog za KviskotekaETF aplikaciju je odbijen.")
        });
      }
    });
  }
});

router.post('/test_username', async (req,res)=>{
  if(req.body.username === undefined){
    res.status(400).json("Parameters missing");
  }
  
  else{
    await UserModel.findOne({ username: req.body.username }).exec((err, user)=>{
      if(err){
        res.status(500).json(err);
      }
      else res.status(200).json(user!=null);
    });
  }

});

router.get('/not_approved', async (req,res)=>{

  await UserModel.find({approvedBy: undefined}).exec((err,data)=>{

    if(err){
      res.status(500).json(err);
    }
    else {
      for(let i=0; i<data.length;i++){
        data[i].password = null;
        data[i].autAnswer = null;
        data[i].personalId = null;
        data[i].autQuestion = null;
      }
      res.status(200).json(data);
    }
  })

})

function sendMail(to,subject,text){

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kviskotekaETF@gmail.com',
      pass: 'akila122'
    }
  });

var mailOptions = {
  from: 'kviskotekaETF@gmail.com',
  to: to,
  subject: subject,
  text: text
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) 
    console.log(error);
});

}

module.exports = router;
