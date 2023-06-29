const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

router.get('/signup', (req, res) => {
    const loggedIn = req.session.user ? true : false;
    res.render('layout', { loggedIn, title: 'Sign Up', main: 'signup' });
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const user = new User({
            username,
            password: hashedPassword,
        });

        await user.save();
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error creating user:', error);
        res.redirect('/auth/signup');
    }
});


router.get('/login', (req, res) => {
    const loggedIn = req.session.user ? true : false;
    res.render('layout', { loggedIn, title: 'Log In', main: 'login' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            // User not found, redirect to login page
            return res.redirect('/auth/login');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // Invalid password, redirect to login page
            return res.redirect('/auth/login');
        }

        // Set user session or generate token as per your authentication approach

        // Assuming you're using sessions
        req.session.user = user;

        // Redirect to the home page
        res.redirect('/home');
    } catch (error) {
        console.error('Error logging in:', error);
        res.redirect('/auth/login');
    }
});


router.get('/logout', (req, res) => {
    // Clear the user session or perform any necessary logout logic
    req.session.destroy((err) => {
      if (err) {
        console.error('Error logging out:', err);
      }
      res.redirect('/auth/login');
    });
  });
  

module.exports = router;
