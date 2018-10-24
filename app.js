// from npm
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

// from controller
const routeController = require('./controller/route');
const userController = require('./controller/user');
const commentController = require('./controller/comment');

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set views
app.set('views', './views');
app.set('view engine', 'ejs');

// static files
app.use(express.static('public'));

// session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 60 * 60 * 1000} // 1hr
}));

// handle route
app.get('/', routeController.index);
app.get('/login', routeController.login);
app.get('/register', routeController.register);

// handle user
app.post('/login', userController.login);
app.post('/register', userController.register);
app.get('/logout', userController.logout);

// handle comment
app.get('/pages/:page', commentController.showComments);
app.post('/insert_comment', commentController.insertComment);
app.post('/modify_comment', commentController.modifyComment);
app.delete('/delete_comment', commentController.deleteComment);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));