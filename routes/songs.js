const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const { generateSongLyrics } = require('../utils/generate');


// Create a new song - GET
router.get('/new', (req, res) => {
  const loggedIn = req.session.user ? true : false;
  res.render('layout', { loggedIn, title: 'Create a New Song', main: 'new-song' });
});

// Create a new song - POST
router.post('/new', async (req, res) => {
  const { title, prompt } = req.body;

  try {
    // Generate song lyrics using the AI model
    const lyrics = await generateSongLyrics(prompt);

    // Save the song data to the session
    req.session.songData = { title, lyrics };

    // Redirect to the song result page
    res.redirect('/songs/result');
  } catch (error) {
    console.error('Error generating song lyrics:', error);
    res.redirect('/songs/result');
  }
});

// Render the song result page
router.get('/result', (req, res) => {
  const { title, lyrics } = req.session.songData || {};

  // Clear the song data from the session
  delete req.session.songData;

  if (!title || !lyrics) {
    // Redirect to the song creation page if the song data is not available
    res.redirect('/songs/new');
  } else {
    const loggedIn = req.session.user ? true : false;
    res.render('song-result', { title, lyrics });
  }
});


// Save the song to the database
router.post('/save', async (req, res) => {
  const { title, lyrics } = req.body;

  try {
    // Create a new song object
    const song = new Song({
      title,
      lyrics,
      user : req.session.user._id,
    });

    // Save the song to the database
    await song.save();

    // Redirect to the song details page
    res.redirect(`/songs/${song._id}`);
  } catch (error) {
    console.error('Error saving song:', error);
    res.redirect('/songs/new');
  }
});

// Redirect to the song creation page
router.get('/retry', (req, res) => {
  res.redirect('/songs/new');
});

// Redirect to the songs list page
router.get('/cancel', (req, res) => {
  res.redirect('/songs/list');
});


// Get all songs - GET
router.get('/list', async (req, res) => {
  const loggedIn = req.session.user ? true : false;

  try {
    const songs = await Song.find({ user: req.session.user._id }, 'title');
    res.render('layout', { loggedIn, title: 'Songs List', main: 'songs-list', songs });
  } catch (error) {
    console.error('Error retrieving songs:', error);
    res.redirect('/');
  }
});

// Get a specific song - GET
router.get('/:id', async (req, res) => {
  const loggedIn = req.session.user ? true : false;
  const { id } = req.params;

  try {
    const song = await Song.findById(id).populate('user', 'username');

    if (song) {
      res.render('layout', { loggedIn, title: song.title, main: 'song-details', song });
    } else {
      res.redirect('/songs/list');
    }
  } catch (error) {
    console.error('Error retrieving song:', error);
    res.redirect('/songs/list');
  }
});

module.exports = router;
