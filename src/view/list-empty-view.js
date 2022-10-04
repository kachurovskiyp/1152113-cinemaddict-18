import AbstractView from '../framework/view/abstract-view.js';
import { FILTER_NAME } from '../util.js';

export default class ListEmptyView extends AbstractView {
  #actualFilter = FILTER_NAME.all;

  get template() {
    return this.#createNewListEmptyTemplate();
  }

  setActualFilter(filterName) {
    this.#actualFilter = filterName;
  }

  #getEmptyString() {
    switch(this.#actualFilter){
      case FILTER_NAME.all:
        return 'There are no movies in our database';
      case FILTER_NAME.favorites:
        return 'There are no favorite movies now';
      case FILTER_NAME.history:
        return 'There are no watched movies now';
      case FILTER_NAME.wathlist:
        return 'There are no movies to watch now';
    }
  }

  #createNewListEmptyTemplate = () => `
    <section class="films-list">
      <h2 class="films-list__title">${this.#getEmptyString()}</h2>
    </section>
  `;
}
