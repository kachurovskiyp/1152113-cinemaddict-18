import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { SORT } from '../util.js';

export default class SortView extends AbstractStatefulView {

  constructor() {
    super();
    this._setState({actualSort: SORT.default});
  }

  get template() {
    return this.#createNewSortTemplate();
  }

  #createNewSortTemplate = () => `
    <ul class="sort">
      <li><a href="#" class="sort__button ${this._state.actualSort === SORT.default ? 'sort__button--active' : ''}" data-sort-type="${SORT.default}">Sort by default</a></li>
      <li><a href="#" class="sort__button ${this._state.actualSort === SORT.byDate ? 'sort__button--active' : ''}" data-sort-type="${SORT.byDate}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${this._state.actualSort === SORT.byRating ? 'sort__button--active' : ''}" data-sort-type="${SORT.byRating}">Sort by rating</a></li>
    </ul>
  `;

  setSortHandler = (callback) => {
    this._callback.sortClick = callback;
    this.element.querySelectorAll('.sort__button').forEach((button) => button.addEventListener('click', this.#sortHandler));
  };

  _restoreHandlers = () => {
    this.element.querySelectorAll('.sort__button').forEach((button) => button.addEventListener('click', this.#sortHandler));
  };

  #sortHandler = (evt) => {
    evt.preventDefault();
    this._callback.sortClick(evt);

    this.updateElement({actualSort: evt.target.dataset.sortType});
  };
}
