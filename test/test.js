'use strict';
const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const passportStub = require('passport-stub');
const User = require('../models/user');
const Movie = require('../models/movie');
const MovieViewingExperience = require('../models/movieviewingexperience');
const deleteMovieAggregate　= require('../routes/movies').deleteMovieAggregate;

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
    //         .end((err, res) => {
    //           if (err) return done(err);
    //           // テストで作成したデータを削除
    //           const movieId = createdMoviePath.split("/movies/")[1];
    //               Movie.findByPk(movieId).then((m) => {
    //                 m.destroy().then(() => {
    //                   if (err) return done(err);
    //                   done();
    //             });
    //           });
    //         });
            .end((err, res) => { deleteMovieAggregate(createdMoviePath.split(`/movies/`)[1], done, err);});
      });
    });
  });
});

describe(`/movies/:movieId/users/:userId/movieviewingexperience/:movieviewingexperience`, () => {
  beforeAll(() => {
    passportStub.install(app);
    passportStub.login({ id: 0, username: 'testuser' });
  });

   afterAll(() => {
     passportStub.logout();
     passportStub.uninstall(app);
   });

   test('視聴経験が更新できる', (done) => {
     User.upsert({ userId: 0, username: 'testuser' }).then(() => {
       request(app)
          .post('/movies')
          .send({ movieTitle: 'テスト映画感想タイトル１', movieDetails: 'テスト映画関連情報１', movieReview: 'テストネタバレなし感想１', movieReviewAll: 'テストネタバレあり感想１'　})
          .end((err ,res) => {
            const createMoviePath = res.headers.location;
            const movieId = createMoviePath.split('/movies/')[1];
            MovieViewingExperience.findOne({
              where: { movieId: movieId }
            }).then((movieviewingexperiences) => {
              // 更新がされることをテスト
              const userId = 0;
              request(app)
                .post(`/movies/${movieId}/users/${userId}/movieviewingexperience/:movieviewingexperience`)
                .send( { movieviewingexperience: 2 }) // 観たに更新
                .expect(`{"status":"OK","movieviewingexperience":2}`)
                .end((err, res) => { 
                  MovieViewingExperience.findAll({
                    where: { movieId: movieId }
                  }).then((movieviewingexperiences) => {
                    assert.strictEqual(movieviewingexperiences.length, 1);
                    assert.strictEqual(movieviewingexperiences[0].movieviewingexperience, 2);
                    deleteMovieAggregate(movieId, done, err); 
                  });
                  });
            });
          });
     });
   });
});

    describe("/movies/:movieId?delete=1", () => {
      beforeAll(() => {
        passportStub.install(app);
        passportStub.login({ id: 0, username: "testuser" });
      });

      afterAll(() => {
        passportStub.logout();
        passportStub.uninstall(app);
      });

      test("感想に関連する全ての情報が削除できる", (done) => {
        User.upsert({ userId: 0, username: "testuser" }).then(() => {
          request(app)
            .post('/movies')
            .send({
              movieTitle: "テスト感想1",
              movieDetails: "テストメモ２",
              movieReview: "テストメモ3",
              movieReviewAll: "テストメモ４",
            })
            .end((err, res) => {
              const createdMoviePath = res.headers.location;
              const movieId = createdMoviePath.split("/movies/")[1];

              //視聴経験作成
              const promiseMovieviewingexperience = MovieViewingExperience.findOne({
                where: {movieId: movieId }
              }).then(movieviewingexperience => {
                return new Promise(resolve => {
                  const userId = 0;
                  request(app)
                    .post(
                      `/movies/${movieId}/users/${userId}/movieviewingexperience/:movieviewingexperience`
                    )
                    .send({ movieviewingexperience: 2}) // 観たに更新
                    .end((err, res) => {
                      if (err) done(err);
                      resolve();
                    });
                });
              });
                // 削除
                const promiseDeleted = Promise.all([
                  promiseMovieviewingexperience
                ]).then(() => {
                  return new Promise(resolve => {
                    request(app)
                      .post(`/movies/${movieId}?delete=1`)
                      .end((err, res) => {
                        if(err) done(err);
                        resolve();
                      });
                  });
                });

                // テスト
                promiseDeleted.then(() => {
                  const p1 = MovieViewingExperience.findAll({
                    where: {movieId: movieId}
                  }).then(movieviewingexperiences => {
                    assert.strictEqual(movieviewingexperiences.length, 0);
                  });
                  const p2 = Movie.findByPk(movieId).then((movie) => {
                    assert.strictEqual(!movie, true);
                  });
                  Promise.all([p1,p2]).then(() => {
                    if (err) return done(err);
                    done();
                  });
                });
            
              });
            });
        });
      });
