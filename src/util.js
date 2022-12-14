import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);


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

const SORT = {
  'default' : 'default',
  'byDate' : 'byDate',
  'byRating' : 'byRating'
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

const UPDATE_TYPE = {
  'PATCH' : 'patch',
  'INIT' : 'init'
};

const USER_RATING = {
  'noviceCount': 1,
  'novice': 'Novice',
  'fanCount': 11,
  'fan': 'Fan',
  'movieBuffCount': 21,
  'movieBuff': 'Movie buff'
};
const FILM_DESCRIPTION_MAX_LENGHT = 139;

const humanizeFilmReleaseDate = (releaseDate) => dayjs(releaseDate).format('D MMM YYYY');

const humanizeFilmReleaseYear = (releaseDate) => dayjs(releaseDate).format('YYYY');

const formatCommentDate = (date) => dayjs(date).fromNow(); //dayjs(date).format('YYYY/MM/DD h:mm');

const formatDurationTime = (time) => `${dayjs.duration(time, 'm').format('H')}h ${dayjs.duration(time, 'm').format('mm')}m`;

const createEmotionElement = (type) => {
  const img = document.createElement('img');
  const selectedEmotiopn = EMOTIONS[type];

  img.width = EMOTIONS.width;
  img.height = EMOTIONS.height;
  img.src = selectedEmotiopn.src;
  img.alt = `${EMOTIONS.alt}-${selectedEmotiopn.name}`;

  return img;
};

export {
  humanizeFilmReleaseDate,
  humanizeFilmReleaseYear,
  formatDurationTime,
  formatCommentDate,
  createEmotionElement,
  FILTER,
  FILTER_NAME,
  SORT,
  EVENT_NAME,
  EMOTIONS,
  UPDATE_TYPE,
  USER_RATING,
  FILM_DESCRIPTION_MAX_LENGHT
};
