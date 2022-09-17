const express = require("express");
const bcrypt = require("bcrypt");
const UserSchema = require("../models/user.model");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello From Users");
});

// insert user
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Please Fill FIelds" });

  // hash pass
  bcrypt.hash(password, 12, (err, hashPass) => {
    if (err) return res.status(500).json({ msg: err.message });
    if (!hashPass) return res.status(400).json({ msg: "Please Try Again" });

    // store details into db

    let insUser = new UserSchema({ email, password: hashPass });

    insUser.save((err, data) => {
      if (err) return res.status(501).json({ msg: err.message });
      if (!data) return res.status(502).json({ msg: "Please Try Again1" });

      res.status(200).json({ msg: data });
    });
  });
});

// get all users
router.get("/all", (req, res) => {
  UserSchema.find({}, (err, data) => {
    if (err) return res.status(501).json({ msg: err.message });
    if (!data) return res.status(502).json({ msg: "Please Try Again1" });

    res.status(200).json({ msg: data });
  });
});


// get single user
router.get("/:_id",(req,res)=>{
  
  const {_id}=req.params

  UserSchema.findOne({_id},(err,data)=>{

    if (err) return res.status(501).json({ msg: err.message });
    if (!data) return res.status(404).json({ msg: "Not Found" });

    res.status(200).json({ msg: data });
  })

})

// delete single user
router.delete("/:_id",(req,res)=>{
  
  const {_id}=req.params

  UserSchema.findByIdAndDelete({_id},(err,data)=>{

    if (err) return res.status(501).json({ msg: err.message });
    if (!data) return res.status(404).json({ msg: "Not Found" });

    res.status(200).json({ msg: "Deleted Successfully" });
  })

})
//  update user
router.put("/:_id",(req,res)=>{
  
  const {_id}=req.params

  const {email}=req.body

  if(!email) return res.status(400).json({msg:"Please Fill Value"})

  UserSchema.findByIdAndUpdate({_id},{email},(err,data)=>{

    if (err) return res.status(501).json({ msg: err.message });
    if (!data) return res.status(404).json({ msg: "Not Found" });

    res.status(200).json({ msg: "Updated Successfully" });
  })

})

module.exports = router;
