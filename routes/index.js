const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const loggedIn = req.session.user ? true : false;
  res.render('layout', { loggedIn, title: 'Song App', main: 'home' });
});

router.get('/home', (req, res) => {
  res.redirect('/');
});

module.exports = router;
