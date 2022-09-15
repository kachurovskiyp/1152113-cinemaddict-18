import AbstractView from '../framework/view/abstract-view.js';
import { humanizeFilmReleaseDate, FILTER } from '../util';

const createContentDetailsTemplate = (film) => `
  <div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./${film.film_info.poster}" alt="">
        <p class="film-details__age">18+</p>
      </div>
      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${film.film_info.title}</h3>
            <p class="film-details__title-original">Original: ${film.film_info.alternative_title}</p>
          </div>
          <div class="film-details__rating">
            <p class="film-details__total-rating">${film.film_info.total_rating}</p>
          </div>
        </div>
        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${film.film_info.director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${film.film_info.writers.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${film.film_info.actors.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${humanizeFilmReleaseDate(film.film_info.release.date)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${film.film_info.runtime}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${film.film_info.release.release_country}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">${film.film_info.genre.length > 1 ? 'Genres' : 'Genre'}</td>
            <td class="film-details__cell">
              <span class="film-details__genre">${film.film_info.genre.join(', ')}</span>
          </tr>
        </table>
        <p class="film-details__film-description">
        ${film.film_info.description}
        </p>
      </div>
    </div>
      <section class="film-details__controls">
        <button
          type="button"
          class="film-details__control-button film-details__control-button--watchlist ${film.user_details.watchlist ? 'film-details__control-button--active' : ''}"
          id="watchlist"
          name="watchlist"
          data-name="${FILTER.watchlist}">
            Add to watchlist
        </button>
        <button
          type="button"
          class="film-details__control-button film-details__control-button--watched ${film.user_details.already_watched ? 'film-details__control-button--active' : ''}"
          id="watched"
          name="watched"
          data-name="${FILTER.history}">
            Already watched
        </button>
        <button
          type="button" class="film-details__control-button film-details__control-button--favorite ${film.user_details.favorite ? 'film-details__control-button--active' : ''}"
          id="favorite"
          name="favorite"
          data-name="${FILTER.favorite}">
            Add to favorites
        </button>
      </section>
    </div>
  `;

export default class ContentDetailsView extends AbstractView {
  constructor(content, id) {
    super();
    this.films = content;
    this.id = id;
  }

  get template() {
    return createContentDetailsTemplate(this.films, this.id);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(evt);
  };

  #EscDownHandler = (evt) => {
    evt.preventDefault();
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._callback.escDown(evt);
    }

  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  setEscDownHandler = (callback) => {
    this._callback.escDown = callback;
    document.addEventListener('keydown', this.#EscDownHandler);
  };

  #clickWatchlistHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickWatchlist(evt);
  };

  #clickHistoryHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickHistory(evt);
  };

  #clickFavoriteHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickFavorite(evt);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.clickWatchlist = callback;
    this.element.querySelector(`[data-name="${FILTER.watchlist}"]`).addEventListener('click', this.#clickWatchlistHandler);
  };

  setHistoryClickHandler = (callback) => {
    this._callback.clickHistory = callback;
    this.element.querySelector(`[data-name="${FILTER.history}"]`).addEventListener('click', this.#clickHistoryHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.clickFavorite = callback;
    this.element.querySelector(`[data-name="${FILTER.favorite}"]`).addEventListener('click', this.#clickFavoriteHandler);
  };
}
