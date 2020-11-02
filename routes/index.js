var express = require('express');
var Movie = require('../models/movie');
var router = express.Router();
const moment = require('moment-timezone');

/* GET home page. */
router.get('/', (req, res, next) => {
  const title = 'おすすめ映画アプリ';
  if (req.user) {
    Movie.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['updatedAt' ,'DESC']]
    }).then(movies => {
      movies.forEach((movie) => {
        movie.formattedUpdatedAt = moment(movie.updatedAt).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
      });
      res.render('index', {
        title: title,
        user: req.user,
        movies: movies
      });
    });
  } else {
    res.render('index', { title: title, user: req.user });
  }
});

module.exports = router;
