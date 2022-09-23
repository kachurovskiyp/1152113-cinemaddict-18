import Observable from '../framework/observable';
import { FILTER, UPDATE_TYPE } from '../util';

export default class FilmsModel extends Observable{
  #filmsApiService = null;
  #films = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try{
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch {
      this.#films = [];
    }

    this._notify(UPDATE_TYPE.INIT);
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      filmInfo: {...film.film_info,
        ageRating: film.film_info.age_rating,
        alternativeTitle: film.film_info.alternative_title,
        totalRating: film.film_info.total_rating,
        release: {...film.film_info.release,
          releaseCountry: film.film_info.release.release_country
        }
      },

      userDetails: {...film.user_details,
        alreadyWatched: film.already_watched,
        watchingDate: film.watching_date
      }
    };

    delete adaptedFilm.film_info;
    delete adaptedFilm.filmInfo.age_rating;
    delete adaptedFilm.filmInfo.alternative_title;
    delete adaptedFilm.filmInfo.alternative_title;
    delete adaptedFilm.filmInfo.release.release_country;
    delete adaptedFilm.userDetails.already_watched;
    delete adaptedFilm.userDetails.watching_date;
    delete adaptedFilm.user_details;

    return adaptedFilm;
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

  changeData (changedID, type) {
    this.#films = this.#films.map((item) => {
      if (item.id === changedID * 1) {
        return this.#changeElement(item, type);
      }
      return item;
    });

    this._notify(UPDATE_TYPE.PATCH, changedID);
  }
}
