import dayjs from 'dayjs';

const FILTER = {
  'watchlist' : 'watchlist',
  'history' : 'already_watched',
  'favorite' : 'favorite'
};

const EVENT_NAME = {
  'button' : 'BUTTON'
};

const FILM_IDS = [];

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getID = () => {
  FILM_IDS.push(FILM_IDS.length + 1);
  return FILM_IDS[FILM_IDS.length - 1];
};

const humanizeFilmReleaseDate = (releaseDate) => dayjs(releaseDate).format('YYYY');

const formatDurationTime = (time) => `${time} m`;

const changeData = (items, changedID, type) => {

  const index = items.findIndex((item) => item.id === changedID * 1);

  if (index === -1) {
    return items;
  }

  const changedItem = items[index];

  switch(type) {
    case FILTER.watchlist:
      changedItem.user_details.watchlist = !changedItem.user_details.watchlist;
      break;

    case FILTER.history:
      changedItem.user_details.already_watched = !changedItem.user_details.already_watched;
      break;

    case FILTER.favorite:
      changedItem.user_details.favorite = !changedItem.user_details.favorite;
      break;
  }

  return [
    ...items.slice(0, index),
    changedItem,
    ...items.slice(index + 1),
  ];
};

export {getRandomInteger,
  humanizeFilmReleaseDate,
  formatDurationTime,
  getID,
  FILTER,
  EVENT_NAME,
  changeData
};
