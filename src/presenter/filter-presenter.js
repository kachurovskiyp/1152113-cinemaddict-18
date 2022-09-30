import MenuView from '../view/menu-view';
import { render, remove, RenderPosition } from '../framework/render';
import { FILTER_NAME } from '../util';

export default class FilterPresenter{
  #menuView = null;
  #filmsModel = null;
  #contentPlace = null;
  #renderFilms = null;
  #clearFilmsList = null;
  #actualFilter = FILTER_NAME.all;

  constructor(filmsModel, contentPlace, renderFilms, clearFilmsList) {
    this.#filmsModel = filmsModel;
    this.#contentPlace = contentPlace;
    this.#renderFilms = renderFilms;
    this.#clearFilmsList = clearFilmsList;
  }

  get films() {
    return this.#filmsModel.films;
  }

  get actualFilter() {
    return this.#actualFilter;
  }

  init() {
    this.#menuView = new MenuView(this.#countOfFilteredItems(this.films));
    render(this.#menuView, this.#contentPlace);
    this.#menuView.setClickHandler(this.#filterLinkClickHandler);

    this.#filmsModel.addObserver(this.#modelEventHandle);
  }

  #modelEventHandle = () => {
    this.#resetMenu();
  };

  #resetMenu () {
    remove(this.#menuView);
    this.#menuView = new MenuView(this.#countOfFilteredItems(this.films), this.#actualFilter);
    render(this.#menuView, this.#contentPlace, RenderPosition.BEFOREBEGIN);
    this.#menuView.setClickHandler(this.#filterLinkClickHandler);
  }

  #filterLinkClickHandler = (evt) => {
    if(this.#actualFilter !== evt.target.dataset.name) {
      this.#actualFilter = evt.target.dataset.name;
      this.#clearFilmsList();
      this.#renderFilms();
    }
  };

  filterItems (films) {
    switch (this.actualFilter) {
      case FILTER_NAME.all:
        return films;
      case FILTER_NAME.wathlist:
        return films.filter((film) => film.userDetails.watchlist);
      case FILTER_NAME.history:
        return films.filter((film) => film.userDetails.alreadyWatched);
      case FILTER_NAME.favorites:
        return films.filter((film) => film.userDetails.favorite);
    }
  }

  #countOfFilteredItems (films) {
    const filters = {
      'watchlist': 0,
      'history': 0,
      'favorites': 0,
    };

    films.forEach((film) => {
      if (film.userDetails.watchlist) {
        filters.watchlist = filters.watchlist + 1;
      }

      if (film.userDetails.alreadyWatched) {
        filters.history = filters.history + 1;
      }

      if (film.userDetails.favorite) {
        filters.favorites = filters.favorites + 1;
      }

    });

    return filters;
  }
}
