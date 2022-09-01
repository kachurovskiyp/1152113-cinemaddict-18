import { generateFilm } from '../mock/film';

const FILMS_COUNT = 7;

export default class FilmsModel {
  #films = Array.from({length: FILMS_COUNT}, generateFilm);

  get films() {
    return this.#films;
  }
}
