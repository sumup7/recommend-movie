'use strict';
import $ from 'jquery';

// const movieviewingexperience = parseInt(('.movieviewingexperiences-toggle-button').data('movieviewingexperience'));


$('.movieviewingexperiences-toggle-button').each((i, e) => {
  const button = $(e);
  // const movieReviewAllDivided = document.getElementById('movie.movieReviewAll');
  let m = parseInt(button.data('movieviewingexperience'));
  console.log(m);
  if(m === 0 || m === 1) {
    document.getElementById('movieReviewAll').style.display = 'none';
  } else {
  }
  button.click(() => {
    const movieId = button.data('movie-id');
    const userId = button.data('user-id');
    const movieviewingexperience = parseInt(button.data('movieviewingexperience'));
    const nextMovieviewingexperience = (movieviewingexperience + 1) % 3;
    $.post(
      `/movies/${movieId}/users/${userId}/movieviewingexperience/:movieviewingexperience`,
      { movieviewingexperience: nextMovieviewingexperience },
      (data) => {
        button.data('movieviewingexperience', data.movieviewingexperience);
        const movieviewingexperienceLabels = ['観てない', '興味がある', '観た'];
        button.text(movieviewingexperienceLabels[data.movieviewingexperience]);
      }
    );
  });
});