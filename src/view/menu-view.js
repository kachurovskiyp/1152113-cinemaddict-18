import AbstractView from '../framework/view/abstract-view.js';
import { FILTER_NAME } from '../util.js';

const createNewMenuTemplate = (filters, actualFilter) => `
  <nav class="main-navigation">
    <a
      href="#all"
      class="main-navigation__item ${actualFilter === FILTER_NAME.all ? 'main-navigation__item--active' : ''}"
      data-name="${FILTER_NAME.all}">
        All movies
    </a>
    <a
      href="#watchlist"
      class="main-navigation__item ${actualFilter === FILTER_NAME.wathlist ? 'main-navigation__item--active' : ''}"
      data-name="${FILTER_NAME.wathlist}">
        Watchlist
        <span class="main-navigation__item-count">
          ${filters.watchlist}
        </span>
    </a>
    <a
      href="#history"
      class="main-navigation__item ${actualFilter === FILTER_NAME.history ? 'main-navigation__item--active' : ''}"
      data-name="${FILTER_NAME.history}">
        History
        <span class="main-navigation__item-count">
          ${filters.history}
        </span>
    </a>
    <a
      href="#favorites"
      class="main-navigation__item ${actualFilter === FILTER_NAME.favorites ? 'main-navigation__item--active' : ''}"
      data-name="${FILTER_NAME.favorites}">
        Favorites
        <span class="main-navigation__item-count">
          ${filters.favorites}
        </span>
    </a>
  </nav>
  `;

export default class MenuView extends AbstractView {
  #filters = null;
  #actualFilter = null;

  constructor(filters, actualFilter = FILTER_NAME.all) {
    super();
    this.#filters = filters;
    this.#actualFilter = actualFilter;
  }

  get template() {
    return createNewMenuTemplate(this.#filters, this.#actualFilter);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(evt);

    this.element.querySelectorAll('a').forEach((link) => {
      link.classList.remove('main-navigation__item--active');
    });

    evt.target.classList.add('main-navigation__item--active');
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', this.#clickHandler);
    });
  };
}
