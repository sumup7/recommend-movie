'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const uuid = require('uuid');
const Movie = require('../models/movie');
const User = require('../models/user');
//candidate

router.get('/new', authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  const movieId = uuid.v4();
  const updatedAt = new Date();
  Movie.create({
    movieId: movieId,
    movieTitle: req.body.movieTitle.slice(0, 255) || '（名称未設定）',
    movieDetails: req.body.movieDetails,
    movieReview: req.body.movieReview,
    movieReviewAll: req.body.movieReviewAll,
    createdBy: req.user.id,
    updatedAt: updatedAt
  }).then((movie) => {
    res.redirect('/movies/' + movie.movieId);
  });
});

router.get('/:movieId', authenticationEnsurer, (req, res, next) => {
  Movie.findOne({
    include: [
    {
    model: User,
    attributes: ['userId', 'username']
  }],
  where: {
    movieId: req.params.movieId
  },
  order: [['updatedAt', 'DESC']]
}).then((movie) => {
   if (movie) {
   res.render('movie', {
     user: req.user,
     movie: movie,
     users: [req.user],
    //  movieviewingexperience:movieviewingexperience
   });
} else {
  const err = new Error('指定された予定は見つかりません');
  err.status = 404;
  next(err);
}
});
}); 

module.exports = router;