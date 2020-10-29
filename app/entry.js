'use strict';
import $ from 'jquery';
const global = Function('return this;')();
global.jQuery = $;
import bootstrap from 'bootstrap';

$('.movieviewingexperiences-toggle-button').each((i, e) => {
  const button = $(e);
  const m = parseInt(button.data('movieviewingexperience'));
  if(m === 0 || m === 1) {
    document.getElementById('movieReviewAll').style.display = 'none';
  } else if (m === 2) {
    document.getElementById('movieReviewAll').style.display = 'block';
  }
  button.click(() => {
    const movieId = button.data('movie-id');
    const userId = button.data('user-id');
    const movieviewingexperience = parseInt(button.data('movieviewingexperience'));
    const nextMovieviewingexperience = (movieviewingexperience + 1) % 3;
    
    if(nextMovieviewingexperience === 0 || nextMovieviewingexperience === 1) {
      document.getElementById('movieReviewAll').style.display = 'none';
    } else if (nextMovieviewingexperience === 2) {
      document.getElementById('movieReviewAll').style.display = 'block';
    }
    $.post(
      `/movies/${movieId}/users/${userId}/movieviewingexperience/:movieviewingexperience`,
      { movieviewingexperience: nextMovieviewingexperience },
      (data) => {
        button.data('movieviewingexperience', data.movieviewingexperience);
        const movieviewingexperienceLabels = ['観てない', '興味がある', '観た'];
        button.text(movieviewingexperienceLabels[data.movieviewingexperience]);
        
        const buttonStyles = ['btn-danger', 'btn-secondary', 'btn-success'];
        button.removeClass('btn-danger btn-secondary btn-success');
        button.addClass(buttonStyles[data.movieviewingexperience]);
      }
    );
  });
});