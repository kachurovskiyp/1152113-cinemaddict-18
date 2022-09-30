import Observable from '../framework/observable';
import { FILTER, UPDATE_TYPE, SORT } from '../util';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class FilmsModel extends Observable{
  #filmsApiService = null;
  #films = [];
  #uiBlocker = null;
  #defaultSort = null;
  #actualSortType = null;

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
    this.#uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    this.#uiBlocker.block();
    try{
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch {
      this.#films = [];
    }

    this.#defaultSort = this.#films.slice();
    this.#actualSortType = SORT.default;

    this._notify(UPDATE_TYPE.INIT);
    this.#uiBlocker.unblock();
  };

  #changeElement = (item, type) => {
    switch(type) {
      case FILTER.watchlist:
        item.userDetails.watchlist = !item.userDetails.watchlist;
        return item;

      case FILTER.history:
        item.userDetails.alreadyWatched = !item.userDetails.alreadyWatched;
        return item;

      case FILTER.favorite:
        item.userDetails.favorite = !item.userDetails.favorite;
        return item;
    }
  };

  sortFilms = (type) => {
    if(this.#actualSortType !== type) {
      this.#actualSortType = type;

      switch(type){
        case SORT.default:
          if(this.#defaultSort){
            this.#films = this.#defaultSort;
          }
          this._notify(UPDATE_TYPE.INIT);
          break;

        case SORT.byDate:
          this.#films.sort((a, b) => new Date(b.filmInfo.release.date).getTime() - new Date(a.filmInfo.release.date).getTime());
          this._notify(UPDATE_TYPE.INIT);
          break;

        case SORT.byRating:
          this.#films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
          this._notify(UPDATE_TYPE.INIT);
          break;
      }
    }
  };

  changeData = async (changedID, type, callback) => {
    this.#uiBlocker.block();

    const update = this.#changeElement(this.#films.find((film) => film.id === changedID), type);

    try {
      const response = await this.#filmsApiService.updateFilm(this.#adaptToServer(update));
      const updatedFilm = this.#adaptToClient(response);

      this.#films = this.#films.map( (item) => item.id === changedID ? updatedFilm : item);
      this._notify(UPDATE_TYPE.PATCH, changedID);
    }catch {
      callback();
      throw new Error('Can\'t update task');
    }

    this.#uiBlocker.unblock();
  };

  #adaptToClient = (film) => {
    const {
      film_info: {
        age_rating: ageRating,
        alternative_title: alternativeTitle,
        total_rating: totalRating,

        release: {
          release_country: releaseCountry,
          ...restRelease
        },

        ...restInfo
      },

      film_info: filmInfo,

      user_details: {
        already_watched: alreadyWatched,
        watching_date: watchingDate,
        ...restDetails
      },

      user_details: userDetails,
      ...restFilm
    } = film;

    const adaptedFilm = {
      ...restFilm,
      filmInfo,
      userDetails
    };

    adaptedFilm.filmInfo = {...restInfo, ageRating, alternativeTitle, totalRating};
    adaptedFilm.filmInfo.release = {...restRelease, releaseCountry};
    adaptedFilm.userDetails = {...restDetails, alreadyWatched, watchingDate};
    adaptedFilm.id = parseInt(adaptedFilm.id, 10);

    return adaptedFilm;
  };

  #adaptToServer = (film) => {
    /* eslint camelcase:"off" */
    const {
      filmInfo: {
        ageRating: age_rating,
        alternativeTitle: alternative_title,
        totalRating: total_rating,

        release: {
          releaseCountry: release_country,
          ...restRelease
        },

        ...restInfo
      },

      filmInfo: film_info,

      userDetails: {
        alreadyWatched: already_watched,
        watchingDate: watching_date,
        ...restDetails
      },

      userDetails: user_details,
      ...restFilm
    } = film;

    const adaptedFilm = {
      ...restFilm,
      film_info,
      user_details
    };

    adaptedFilm.film_info = {...restInfo, age_rating, alternative_title, total_rating};
    adaptedFilm.film_info.release = {...restRelease, release_country};
    adaptedFilm.user_details = {...restDetails, already_watched, watching_date};
    adaptedFilm.id = String(adaptedFilm.id);

    return adaptedFilm;
  };
}
