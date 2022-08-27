import { generateFilm } from '../mock/film';

const FILMS_COUNT = 5;

export default class FilmsModel {
  films = Array.from({length: FILMS_COUNT}, generateFilm);
  getFilms = () => this.films;
}
