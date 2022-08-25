import { createElement } from '../render';
import { humanizeFilmReleaseDate } from '../util';
import { getFilmIndex } from '../util';

const createContentDetailsTemplate = (films, id) => {
  const index = getFilmIndex(films, id);

  return `
  <div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./${films[index].film_info.poster}" alt="">
        <p class="film-details__age">18+</p>
      </div>
      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${films[index].film_info.title}</h3>
            <p class="film-details__title-original">Original: ${films[index].film_info.alternative_title}</p>
          </div>
          <div class="film-details__rating">
            <p class="film-details__total-rating">${films[index].film_info.total_rating}</p>
          </div>
        </div>
        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${films[index].film_info.director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${films[index].film_info.writers.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${films[index].film_info.actors.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${humanizeFilmReleaseDate(films[index].film_info.release.date)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${films[index].film_info.runtime}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${films[index].film_info.release.release_country}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">${films[index].film_info.genre.length > 1 ? 'Genres' : 'Genre'}</td>
            <td class="film-details__cell">
              <span class="film-details__genre">${films[index].film_info.genre.join(', ')}</span>
          </tr>
        </table>
        <p class="film-details__film-description">
        ${films[index].film_info.description}
        </p>
      </div>
    </div>
      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>
  `;
};

export default class ContentDetailsView {
  constructor(content, id) {
    this.films = content;
    this.id = id;
  }

  getTemplate() {
    return createContentDetailsTemplate(this.films, this.id);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
