import { FILTER_NAME } from '../util';

const countOfFilteredItems = (films) => {
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
};

const filterItems = (films, type) => {
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
};

export {countOfFilteredItems, filterItems};
