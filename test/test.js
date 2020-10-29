'use strict';
const request = require('supertest');
const app = require('../app');
const passportStub = require('passport-stub');
const User = require('../models/user');
const Movie = require('../models/movie');
const MovieViewingExperience = require('../models/movieviewingexperience');

describe('/login', () => {
  beforeAll(() => {
    passportStub.install(app);
    passportStub.login({ username: 'testuser'});
  });

  afterAll(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  })

  test('ログインのためのリンクが含まれる', () => {
  return request(app)
    .get('/login')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(/<a class="btn btn-info my-3" href="\/auth\/github"/)
    .expect(200);
  });

  test('ログイン時はユーザー名が表示される', () => {
    return request(app)
      .get('/login')
      .expect(/testuser/)
      .expect(200);
  });
});

describe('logout', () => {
  test('/ にリダイレクトされる', () => {
    return request(app)
      .get('/logout')
      .expect('Location', '/')
      .expect(302);
  });
});


describe("/movies", () => {
  beforeAll(() => {
    passportStub.install(app);
    passportStub.login({ id: 0, username: "testuser" });
  });

  afterAll(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  test("映画の感想が作成でき、表示される", (done) => {
    User.upsert({ userId: 0, username: "testuser" }).then(() => {
      request(app)
        .post("/movies")
        .send({
          movieTitle: "テスト予定1",
          movieDetails: "テストメモ1\r\nテストメモ2",
          movieReview: "テストメモ3\r\nテストメモ4",
          movieReviewAll: "テストメモ5\r\nテストメモ6",
        })
        .expect("Location", /movies/)
        .expect(302)
        .end((err, res) => {
          const createdMoviePath = res.headers.location;
          console.log(createdMoviePath);
          request(app)
            .get(createdMoviePath)
            .expect(/テスト予定1/)
            .expect(/テストメモ1/)
            .expect(/テストメモ2/)
            .expect(/テストメモ3/)
            .expect(/テストメモ4/)
            .expect(/テストメモ5/)
            .expect(/テストメモ6/)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              // テストで作成したデータを削除
              const movieId = createdMoviePath.split("/movies/")[1];
              MovieViewingExperience.findAll({
                where: { movieId: movieId },
              }).then((movieviewingexperiences) => {
                const promises = movieviewingexperiences.map((m) => {
                  return m.destroy();
                });
                Promise.all(promises).then(() => {
                  Movie.findByPk(movieId).then((s) => {
                    s.destroy().then(() => {
                      if (err) return done(err);
                      done();
                    });
                  });
                });
              });
            });
        });
    });
  });
});


