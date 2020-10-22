'use strict';
import $ from 'jquery';

// const movieviewingexperience = parseInt(('.movieviewingexperiences-toggle-button').data('movieviewingexperience'));


$('.movieviewingexperiences-toggle-button').each((i, e) => {
  const button = $(e);
  
  // const movieReviewAllDivided = document.getElementById('movie.movieReviewAll');
  // let m = parseInt(button.data('movieviewingexperience'));
  // let m = movieviewingexperienceMapMap.get(user.userId);
  //   console.log(m);
  //   if(m === 0 || m === 1) {
  //     document.getElementById('movieReviewAll').style.display = 'none';
  // } else if (m === 2)  {
  //     document.getElementById('movieReviewAll').style.display = 'block';
  // }
  button.click(() => {
    const movieId = button.data('movie-id');
    const userId = button.data('user-id');
    const movieviewingexperience = parseInt(button.data('movieviewingexperience'));
    // const movieReviewAllDivided = document.getElementById('movieReview');
    // const movieReviewAll1 = '視聴してからご覧下さい';
    // const movieReviewAll2 = '興味があるならご覧下さい';
    // const movieReviewAll3 = button.data('movieReviewAll');
    const nextMovieviewingexperience = (movieviewingexperience + 1) % 3;
    if(nextMovieviewingexperience === 0 || nextMovieviewingexperience === 1) {
      document.getElementById('movieReview').style.display = 'none';
    } else if (nextMovieviewingexperience === 2) {
      document.getElementById('movieReview').style.display = 'block';
    }
    $.post(
      `/movies/${movieId}/users/${userId}/movieviewingexperience/:movieviewingexperience`,
      { movieviewingexperience: nextMovieviewingexperience },
      (data) => {
        button.data('movieviewingexperience', data.movieviewingexperience);
        // movieReviewAllDivided.data('movieviewingexperience', data.movieviewingexperience);
        // const movieReviewLabels = [movieReviewAll1,movieReviewAll2 ,movieReviewAll3];
        const movieviewingexperienceLabels = ['観てない', '興味がある', '観た'];
        button.text(movieviewingexperienceLabels[data.movieviewingexperience]);
        // movieReviewAllDivided.text(movieReviewLabels[data.movieviewingexperience]);
      }
    );
  });
});