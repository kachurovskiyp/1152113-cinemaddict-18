import AbstractView from '../framework/view/abstract-view.js';
import { FILTER_NAME } from '../util.js';

const createNewMenuTemplate = (filters) => `
  <nav class="main-navigation">
    <a
      href="#all"
      class="main-navigation__item main-navigation__item--active"
      data-name="${FILTER_NAME.all}">
        All movies
    </a>
    <a
      href="#watchlist"
      class="main-navigation__item"
      data-name="${FILTER_NAME.wathlist}">
        Watchlist
        <span class="main-navigation__item-count">
          ${filters.watchlist}
        </span>
    </a>
    <a
      href="#history"
      class="main-navigation__item"
      data-name="${FILTER_NAME.history}">
        History
        <span class="main-navigation__item-count">
          ${filters.history}
        </span>
    </a>
    <a
      href="#favorites"
      class="main-navigation__item"
      data-name="${FILTER_NAME.favorites}">
        Favorites
        <span class="main-navigation__item-count">
          ${filters.favorites}
        </span>
    </a>
  </nav>
  `;

export default class MenuView extends AbstractView {

  constructor(filters) {
    super();
    this.filters = filters;
  }

  get template() {
    return createNewMenuTemplate(this.filters);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(evt);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', this.#clickHandler);
    });
  };
}
