var {User, validate} = require('../models/user');
var express = require('express');
var router = express.Router();
var _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');


/* POST new user. */
router.post('/', async function(req, res, next){
  console.log('erdfd',req.body);

  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  
  let user = await User.findOne({email : req.body.email});
  if (user) return res.status(400).send('User already registered.');
     
  user = new User(req.body);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);  

  await user.save();
  token = user.generateAuthToken();
  res.header('x-auth-token',token).send( _.pick(user, ['_id', 'email', 'liked_shops']));

})

/* UPDATE user. */
router.put('/me',auth, function(req, res, next){
  User.findByIdAndUpdate(req.user._id, req.body,{new : true}, function(err, result){
    if(err) return next(err);
    res.json(_.pick(result, ['_id', 'email', 'liked_shops']))
  })
})

/*router.post('/:id',authorization, function(req, res, next){
  User.findByIdAndUpdate(req.params.id, req.body, function(err, result){
    if(err) return next(err);
    res.json(result)
  })
})*/

module.exports = router;
