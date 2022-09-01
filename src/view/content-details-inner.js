import { createElement } from '../render';

const createContentDetailsInnerTemplate = () => `
<div class="film-details__inner"></div>
`;

export default class ContentDetailsInnerView {
  #element = null;

  get template() {
    return createContentDetailsInnerTemplate();
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
