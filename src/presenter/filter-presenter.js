import MenuView from '../view/menu-view';
import { render, remove, RenderPosition } from '../framework/render';
import { FILTER_NAME } from '../util';

export default class FilterPresenter{
  #menuView = null;
  #filmsModel = null;
  #contentPlace = null;
  #clearFilmsList = null;
  #renderFilms = null;
  #actualFilter = FILTER_NAME.all;

  constructor(filmsModel, contentPlace, clearFilmsList, renderFilms) {
    this.#filmsModel = filmsModel;
    this.#contentPlace = contentPlace;
    this.#clearFilmsList = clearFilmsList;
    this.#renderFilms = renderFilms;
  }

  get films() {
    return this.#filmsModel.films;
  }

  init() {
    this.#menuView = new MenuView(this.#countOfFilteredItems(this.films));
    render(this.#menuView, this.#contentPlace);
    this.#menuView.setClickHandler(this.#onFilterLinkClick);
    this.#filmsModel.addObserver(this.#modelEventHandle);
  }

  #modelEventHandle = () => {
    this.#resetMenu();
  };

  #resetMenu () {
    remove(this.#menuView);
    this.#menuView = new MenuView(this.#countOfFilteredItems(this.films), this.#actualFilter);
    render(this.#menuView, this.#contentPlace, RenderPosition.BEFOREBEGIN);
    this.#menuView.setClickHandler(this.#onFilterLinkClick);
  }

  #onFilterLinkClick = (evt) => {
    this.#actualFilter = evt.target.dataset.name;
    this.#clearFilmsList();
    this.#renderFilms(this.#filterItems(this.films, this.#actualFilter));
  };

  #filterItems (films, type) {
    switch (type) {
      case FILTER_NAME.all:
        return films;
      case FILTER_NAME.wathlist:
        return films.filter((film) => film.user_details.watchlist);
      case FILTER_NAME.history:
        return films.filter((film) => film.user_details.alreadyWatched);
      case FILTER_NAME.favorites:
        return films.filter((film) => film.user_details.favorite);
    }
  }

  #countOfFilteredItems (films) {
    const filters = {
      'watchlist': 0,
      'history': 0,
      'favorites': 0,
    };

    films.forEach((film) => {
      if (film.user_details.watchlist) {
        filters.watchlist = filters.watchlist + 1;
      }

      if (film.user_details.alreadyWatched) {
        filters.history = filters.history + 1;
      }

      if (film.user_details.favorite) {
        filters.favorites = filters.favorites + 1;
      }

    });

    return filters;
  }
}
