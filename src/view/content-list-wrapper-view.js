import { createElement } from '../render';

const createContentListWrapperTemplate = () => `
  <div class="films-list__container"></div>
`;

export default class ContentListWrapperView {
  #element = null;

  get template() {
    return createContentListWrapperTemplate();
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
