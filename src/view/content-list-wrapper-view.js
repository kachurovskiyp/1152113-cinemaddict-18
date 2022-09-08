import AbstractView from '../framework/view/abstract-view.js';

const createContentListWrapperTemplate = () => `
  <div class="films-list__container"></div>
`;

export default class ContentListWrapperView extends AbstractView {
  get template() {
    return createContentListWrapperTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(evt);
  };
}
