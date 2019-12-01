var { User } = require('../models/user');
var express = require('express');
var router = express.Router();
var _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* POST new user. */
router.post('/', async function (req, res, next) {
    console.log('erdfd', req.body);

    const { error } = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword =  bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');
    
    token = user.generateAuthToken();
    res.header('x-auth-token',token).send( _.pick(user, ['_id', 'email', 'liked_shops']));
 
})

function validate(req) {
    const schema = {
        email: Joi.string().min(8).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    }
    return Joi.validate(user, schema);
}

module.exports = router;
