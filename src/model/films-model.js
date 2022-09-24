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

  changeData = async (changedID, type) => {

    const update = this.#changeElement(this.#films.find((film) => film.id === changedID), type);

    try {
      const response = await this.#filmsApiService.updateFilm(this.#adaptToServer(update));
      const updatedFilm = this.#adaptToClient(response);

      this.#films = this.#films.map((item) => {
        if (item.id === changedID) {
          return updatedFilm;
        }
        return item;
      });
      this._notify(UPDATE_TYPE.PATCH, changedID);
    }catch {
      throw new Error('Can\'t update task');
    }
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
        alreadyWatched: film.user_details.already_watched,
        watchingDate: film.user_details.watching_date
      }
    };

    delete adaptedFilm.film_info;
    delete adaptedFilm.filmInfo.age_rating;
    delete adaptedFilm.filmInfo.alternative_title;
    delete adaptedFilm.filmInfo.total_rating;
    delete adaptedFilm.filmInfo.release.release_country;
    delete adaptedFilm.userDetails.already_watched;
    delete adaptedFilm.userDetails.watching_date;
    delete adaptedFilm.user_details;

    adaptedFilm.id = parseInt(adaptedFilm.id, 10);
    //console.log(adaptedFilm);

    return adaptedFilm;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {...film,
      /* eslint-disable */
      film_info: {
          "title": film.filmInfo.title,
          "alternative_title": film.filmInfo.alternativeTitle,
          "total_rating": film.filmInfo.totalRating,
          "poster": film.filmInfo.poster,
          "age_rating": film.filmInfo.ageRating,
          "director": film.filmInfo.director,
          "writers": film.filmInfo.writers,
          "actors": film.filmInfo.actors,
          "release": {
            "date": film.filmInfo.release.date,
            "release_country": film.filmInfo.release.releaseCountry
          },
          "runtime": film.filmInfo.runtime,
          "genre": film.filmInfo.genre,
          "description": film.filmInfo.description
        },

      user_details: {...film.userDetails,
        'already_watched': film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate
      }
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.film_info.ageRating;
    delete adaptedFilm.film_info.alternativeTitle;
    delete adaptedFilm.film_info.totalRating;
    delete adaptedFilm.film_info.release.releaseCountry;
    delete adaptedFilm.user_details.alreadyWatched;
    delete adaptedFilm.user_details.watchingDate;
    delete adaptedFilm.userDetails;
    adaptedFilm.id = String(adaptedFilm.id);
    return adaptedFilm;
  };
}
