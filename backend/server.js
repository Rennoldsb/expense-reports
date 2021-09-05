const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const port = process.env.port || 5000;

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Mongo Connected!'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:3000', //React location
    credentials: true,
  })
);

app.use(cookieParser('secret'));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

require('./configs/passportConfig')(passport);
app.use(passport.initialize());
app.use(passport.session());
// ---------------- End Middleware

app.use('/', authRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
