// index.js
const express = require('express');
const session = require('express-session');
const connectDB = require('./db'); // Import the connectDB function
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const session_key = 'kuMfKiYJvC'

app.use(session({
  secret: session_key,
  resave: false,
  saveUninitialized: false
}));

const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const songRoute = require('./routes/songs');

app.use('/', indexRoute);
app.use('/auth', authRoute);
app.use('/songs', songRoute);

const PORT = 3000;

// Call connectDB to establish the database connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
  });
