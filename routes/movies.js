'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const uuid = require('uuid');
const Movie = require('../models/movie');
const User = require('../models/user');
const MovieViewingExperience = require('../models/movieviewingexperience');
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
    movieDetails: req.body.movieDetails.slice(0, 255) || '（名称未設定）',
    movieReview: req.body.movieReview.slice(0, 1000),
    movieReviewAll: req.body.movieReviewAll.slice(0, 1000),
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
  // データベースからその映画の全ての視聴経験を取得する
  if(movie) {
    MovieViewingExperience.findAll({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }
    ],
    where: { movieId: movie.movieId},
    order: [[User, 'username', 'ASC']]
    // ,['movieviewingexperience', 'ASC']]
  }).then((movieviewingexperiences) => {
    //視聴経験MapMap(キー：ユーザーid　値：map)(キー：movieId 値：movieviewingexperience)
    const movieviewingexperienceMapMap = new Map();
    movieviewingexperiences.forEach((m) => {
  //   // const map = movieviewingexperienceMapMap.get(m.user.userId) || new Map();
  //   // map.set(m.movieId, m.movieviewingexperience);
    
  //   // map.set(m.movieId, a);
  //   movieviewingexperienceMapMap.set(u.userId, a);
    movieviewingexperienceMapMap.set(m.user.userId, m.movieviewingexperience);
    
  });
  console.log(movieviewingexperienceMapMap);
  
  // 閲覧データと視聴経験に紐づくユーザーからユーザー　Map　（キー:ユーザーID、値：ユーザー）を作る
  const userMap = new Map(); // key: userId, value: User
  userMap.set(parseInt(req.user.id), {
      isSelf: true,
      userId: parseInt(req.user.id),
      username: req.user.username
  });
  movieviewingexperiences.forEach((m) => {
    userMap.set(m.user.userId, {
      isSelf: parseInt(req.user.id) === m.user.userId, // 閲覧ユーザー自身であるかを含める
      userId: m.user.userId,
      username: m.user.username
    });
  });
  //全ユーザーでループして出欠の値がない場合には、「観てない」を設定する
  const users = Array.from(userMap).map((keyValue) => keyValue[1]);
  users.forEach((u) => {
//     movieviewingexperiences.forEach((m) => {
//     // const map = movieviewingexperienceMapMap.get(u.userId) || new Map();
      const a = movieviewingexperienceMapMap.get(u.userId) || 0; // デフォルト値は 0 を利用
      movieviewingexperienceMapMap.set(u.userId, a);
      //   });
});

   res.render('movie', {
     user: req.user,
     movie: movie,
    //  movieviewingexperiences:movieviewingexperiences,
     users: users,
     movieviewingexperienceMapMap:movieviewingexperienceMapMap
    //  movieviewingexperience:movieviewingexperience
   });
  });
} else {
  const err = new Error('指定された予定は見つかりません');
  err.status = 404;
  next(err);
}
});
}); 

module.exports = router;