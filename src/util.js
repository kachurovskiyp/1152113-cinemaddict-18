import dayjs from 'dayjs';

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

export {getRandomInteger,
  humanizeFilmReleaseDate,
  formatDurationTime,
  getID
};
