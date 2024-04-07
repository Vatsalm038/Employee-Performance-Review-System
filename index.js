require('./config/database').connect();
const express = require('express');
const cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser'); 
const app = express();
const { PORT, MONGODB_URL, SESSION_SECRET_KEY } = process.env;
const expressLayouts = require('express-ejs-layouts');


const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(expressLayouts);


app.set('view engine', 'ejs');
app.set('views', './views');


app.use(
  session({
    name: 'employee-review-system',
    secret: SESSION_SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: MONGODB_URL,
      autoRemove: 'disabled',
    }),
    function(err) {
      console.log(err || 'connect-mongodb setup ok');
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);


app.use('/', require('./routes'));

app.listen(PORT || 5000, (err) => {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${PORT}`);
});
