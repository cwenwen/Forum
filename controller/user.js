const User = require('../model/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports =  {

  register: (req, res) => {
    bcrypt
      .hash(req.body.password, saltRounds)
      .then(hash => {
        return User
          .create({
            username: req.body.username,
            password: hash,
            nickname: req.body.nickname
          })
      })
      .then(() => {
        req.session.username = req.body.username;
        req.session.nickname = req.body.nickname;
        res.send('ok');
      })
      .catch(error => {
        res.send('error');
      })
  },

  login : (req, res) => {
    User
      .findAll({
        where: {
          username: req.body.username,
        }
      })
      .then(data => {
        bcrypt
          .compare(req.body.password, data[0].dataValues.password)
          .then(response => {
            if (response) {
              // Passwords match
              req.session.username = data[0].dataValues.username;
              req.session.nickname = data[0].dataValues.nickname;
              res.send('ok');
          
            } else {
              // Passwords don't match
              res.send('error');
            } 
          })
          .catch(err => {throw err})
      })
      .catch(error => {
        res.send('error');
      })
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/');
  }
}