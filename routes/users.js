var {User, validate} = require('../models/user');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


/* POST new user. */
router.post('/', async function(req, res, next){
  console.log('erdfd',req.body);

  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  
  let user = await User.findOne({email : req.body.email});
  if (user) return res.status(400).send('User already registered.');
     
  user = new User(req.body);

  await user.save();
  res.send(user);


})

module.exports = router;
