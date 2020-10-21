'use strict';
import $ from 'jquery';

$('.movieviewingexperiences-toggle-button').each((i, e) => {
  const button = $(e);
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