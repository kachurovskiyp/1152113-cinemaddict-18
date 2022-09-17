import dayjs from 'dayjs';

const FILTER = {
  'watchlist' : 'watchlist',
  'history' : 'alreadyWatched',
  'favorite' : 'favorite'
};

const FILTER_NAME = {
  'all' : 'allMovies',
  'wathlist' : 'watchlist',
  'history' : 'history',
  'favorites' : 'favorites'
};

const EVENT_NAME = {
  'button' : 'BUTTON',
  'img' : 'IMG',
  'label' : 'LABEL'
};

const EMOTIONS = {
  'smile' : {
    'name' : 'smile',
    'src' : './images/emoji/smile.png',
  },
  'sleeping' : {
    'name' : 'sleeping',
    'src' : './images/emoji/sleeping.png',
  },
  'puke' : {
    'name' : 'puke',
    'src' : './images/emoji/puke.png',
  },
  'angry' : {
    'name' : 'angry',
    'src' : './images/emoji/angry.png',
  },

  'width' : '55',
  'height' : '55',
  'alt' : 'emoji'
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

const changeElement = (item, type) => {
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

const changeData = (items, changedID, type) => items.map((item) => {
  if (item.id === changedID * 1) {
    return changeElement(item, type);
  }
  return item;
});

const createEmotionElement = (type) => {
  const img = document.createElement('img');
  img.width = EMOTIONS.width;
  img.height = EMOTIONS.height;
  switch (type) {
    case EMOTIONS.smile.name:
      img.alt = `${EMOTIONS.alt}-${EMOTIONS.smile.name}`;
      img.src = EMOTIONS.smile.src;
      break;

    case EMOTIONS.sleeping.name:
      img.alt = `${EMOTIONS.alt}-${EMOTIONS.sleeping.name}`;
      img.src = EMOTIONS.sleeping.src;
      break;

    case EMOTIONS.puke.name:
      img.alt = `${EMOTIONS.alt}-${EMOTIONS.puke.name}`;
      img.src = EMOTIONS.puke.src;
      break;

    case EMOTIONS.angry.name:
      img.alt = `${EMOTIONS.alt}-${EMOTIONS.angry.name}`;
      img.src = EMOTIONS.angry.src;
      break;
  }

  return img;
};

export {getRandomInteger,
  humanizeFilmReleaseDate,
  formatDurationTime,
  createEmotionElement,
  getID,
  FILTER,
  FILTER_NAME,
  EVENT_NAME,
  EMOTIONS,
  changeData
};
