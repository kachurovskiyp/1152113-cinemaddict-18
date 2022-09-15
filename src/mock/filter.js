export const filter = (films) => {
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
