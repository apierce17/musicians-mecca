const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/User');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');


// Database
const db = require('./config/database');

// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

const app = express();

app.use(cookieParser());
app.use(morgan('dev'));

app.use(session({
  key: 'user_sid',
  secret: 'somesecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
})); 

// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main',runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
      }
   }));
app.set('view engine', 'handlebars');

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user){
      res.clearCookie('user_sid');
  }
  next();
});

var hbsContent = {userName:'', loggedin: false, title:"You are not logged in", body: "Hello World"};

var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      res.redirect('/users');
  } else {
      next();
  }
};

// route for home-page
app.get('/', sessionChecker, (req, res) => {
  res.redirect('/login');
});


// route for user's dashboard
app.get('/index', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
      hbsContent.loggedin = true;
      hbsContent.userName = req.session.user.username;
      hbsContent.title = "You are logged in";

      res.render('users', { hbsContent, layout: 'landing' });
  } else {
      res.redirect('/login');
  }
})

app.get('/users', (req, res) => {

  if (req.session.user && req.cookies.user_sid) {
    User.findAll()
    .then(users => res.render('users', {users : users}))
    .catch(err => res.render('error', {error: err}));
  } else {
      res.redirect('/login');
  }
})


//route for signup
app.route('/signup')
    .get((req, res) => {
        res.render('signup', hbsContent);
    })
    .post((req, res) => {
        User.create ({
            username: req.body.username,
            password: req.body.password,
            inputfirstname: req.body.inputfirstname,
            inputlastname: req.body.inputlastname,
            email: req.body.email,
            role: req.body.role,
            instrument: req.body.instrument,
            style: req.body.style,
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/users');
        })
        .catch(error => {
            res.redirect('/signup');
        });
    });

    // route for user login
app.route('/login')
.get((req, res) => {
    res.render('login', hbsContent);
})
.post((req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({ where: { username: username } }).then(function (user) {
        if (!user) {
            res.redirect('/login');
        } else if (!user.validPassword(password)) {
            res.redirect('/login');
        } else {
            req.session.user = user.dataValues;
            res.redirect('/users');
        }
    });
});


// route for user logout
app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
      hbsContent.loggedin = false;
      hbsContent.title = "You are logged out!";
      res.clearCookie('user_sid');
      res.redirect('/');
  } else {
      res.redirect('/login');
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, console.log(`Server started on port ${PORT}`));