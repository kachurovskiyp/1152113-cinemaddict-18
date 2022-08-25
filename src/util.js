import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getUniqueInteger = (min, max) => {
  const numbers = [...Array(max - min + 1)].map((n, i) => min + i).sort(()=>Math.random() < 0.5 ? - 1 : 1);
  return numbers.shift();
};

const humanizeFilmReleaseDate = (releaseDate) => dayjs(releaseDate).format('YYYY');

const formatDurationTime = (time) => `${time} m`;

const getFilmIndex = (films, id) => {
  let index;
  films.forEach((film, i) => {
    if(film.id === id * 1) {
      index = i;
    }
  });
  return index;
};

export {getRandomInteger,
  humanizeFilmReleaseDate,
  formatDurationTime,
  getUniqueInteger,
  getFilmIndex
};
