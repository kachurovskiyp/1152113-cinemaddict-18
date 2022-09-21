import Observable from '../framework/observable';
import { FILTER } from '../util';
import { generateFilm } from '../mock/film';

const FILMS_COUNT = 5;

export default class FilmsModel extends Observable{
  #films = Array.from({length: FILMS_COUNT}, generateFilm);

  get films() {
    return this.#films;
  }

  #changeElement = (item, type) => {
    switch(type) {
      case FILTER.watchlist:
        item.user_details.watchlist = !item.user_details.watchlist;
        return item;

      case FILTER.history:
        item.user_details.alreadyWatched = !item.user_details.alreadyWatched;
        return item;

      case FILTER.favorite:
        item.user_details.favorite = !item.user_details.favorite;
        return item;
    }
  };

  changeData (changedID, type) {
    this.#films = this.#films.map((item) => {
      if (item.id === changedID * 1) {
        return this.#changeElement(item, type);
      }
      return item;
    });
    this._notify(changedID);
  }
}
