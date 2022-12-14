import AbstractView from '../framework/view/abstract-view.js';
import { humanizeFilmReleaseYear } from '../util';
import { formatDurationTime } from '../util';
import { FILTER, FILM_DESCRIPTION_MAX_LENGHT } from '../util';

const getFilmGeners = (genre) => genre.join(', ');

const createNewFilmCardTemplate = (film) => `
  <article class="film-card" id="${film.id}">
    <a class="film-card__link">
      <h3 class="film-card__title">${film.filmInfo.title}</h3>
      <p class="film-card__rating">${film.filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${humanizeFilmReleaseYear(film.filmInfo.release.date)}</span>
        <span class="film-card__duration">${formatDurationTime(film.filmInfo.runtime)}</span>
        <span class="film-card__genre">${getFilmGeners(film.filmInfo.genre)}</span>
      </p>
      <img src="./${film.filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">
    ${film.filmInfo.description.length > FILM_DESCRIPTION_MAX_LENGHT ?
    `${film.filmInfo.description.slice(0, FILM_DESCRIPTION_MAX_LENGHT)}...` :
    film.filmInfo.description}
      </p>
      <span class="film-card__comments">${film.comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button
        class="film-card__controls-item film-card__controls-item--add-to-watchlist ${film.userDetails.watchlist ? 'film-card__controls-item--active' : ''}"
        type="button"
        data-name="${FILTER.watchlist}">
          Add to watchlist
      </button>
      <button
        class="film-card__controls-item film-card__controls-item--mark-as-watched ${film.userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''}"
        type="button"
        data-name="${FILTER.history}">
          Mark as watched
      </button>
      <button
        class="film-card__controls-item film-card__controls-item--favorite ${film.userDetails.favorite ? 'film-card__controls-item--active' : ''}"
        type="button"
        data-name="${FILTER.favorite}">
          Mark as favorite
      </button>
    </div>
  </article>
`;

export default class FilmCardView extends AbstractView {
  constructor(film) {
    super();
    this.film = film;
  }

  get template() {
    return createNewFilmCardTemplate(this.film);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(evt);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickWatchlist(evt);
  };

  #historyClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickHistory(evt);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickFavorite(evt);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.clickWatchlist = callback;
    this.element.querySelector(`[data-name="${FILTER.watchlist}"]`).addEventListener('click', this.#watchlistClickHandler);
  };

  setHistoryClickHandler = (callback) => {
    this._callback.clickHistory = callback;
    this.element.querySelector(`[data-name="${FILTER.history}"]`).addEventListener('click', this.#historyClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.clickFavorite = callback;
    this.element.querySelector(`[data-name="${FILTER.favorite}"]`).addEventListener('click', this.#favoriteClickHandler);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  resetCommentsCount = (commentsCount) => {
    this.element.querySelector('.film-card__comments').innerHTML = `${commentsCount} comments`;
  };
}


