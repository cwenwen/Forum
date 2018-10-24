module.exports = {
  index: (req, res) =>{
    res.redirect('/pages/1');
  },
  
  login: (req, res) => {
    res.render('login');
  },

  register: (req, res) => {
    res.render('register');
  }
}