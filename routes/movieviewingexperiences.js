'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const MovieViewingExperience = require('../models/movieviewingexperience');

router.post(
  '/:movieId/users/:userId/movieviewingexperience/:movieviewingexperience',
  authenticationEnsurer,
  (req, res, next) => {
    const movieId = req.params.movieId;
    const userId = req.params.userId;
    let movieviewingexperience = req.body.movieviewingexperience;
    movieviewingexperience = movieviewingexperience ? parseInt(movieviewingexperience) : 0;

    MovieViewingExperience.upsert({
      movieId: movieId,
      userId: userId,
      movieviewingexperience: movieviewingexperience
    }).then(() => {
      res.json({ status: 'OK', movieviewingexperience: movieviewingexperience });
    });
  }
);

module.exports = router;