import AbstractView from '../framework/view/abstract-view.js';

const createNewMenuTemplate = (filters) => `
  <nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filters.watchlist}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filters.history}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites<span class="main-navigation__item-count">${filters.favorites}</span></a>
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
}
