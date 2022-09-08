import AbstractView from '../framework/view/abstract-view.js';
import { humanizeFilmReleaseDate } from '../util';
import { formatDurationTime } from '../util';

const getFilmGeners = (genre) => genre.join(', ');

const getCommmentsCount = (comments, film) =>
  comments.filter((comment) => comment[0].id === film.id).length;

const createNewFilmCardTemplate = (film, comments) => `
  <article class="film-card" id="${film.id}">
    <a class="film-card__link">
      <h3 class="film-card__title">${film.film_info.title}</h3>
      <p class="film-card__rating">${film.film_info.total_rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${humanizeFilmReleaseDate(film.film_info.release.date)}</span>
        <span class="film-card__duration">${formatDurationTime(film.film_info.runtime)}</span>
        <span class="film-card__genre">${getFilmGeners(film.film_info.genre)}</span>
      </p>
      <img src="./${film.film_info.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${film.film_info.description}</p>
      <span class="film-card__comments">${getCommmentsCount(comments, film)} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist film-card__controls-item--active" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
    </div>
  </article>
`;

export default class FilmCardView extends AbstractView {
  constructor(film, comments) {
    super();
    this.film = film;
    this.comments = comments;
  }

  get template() {
    return createNewFilmCardTemplate(this.film, this.comments);
  }
}
