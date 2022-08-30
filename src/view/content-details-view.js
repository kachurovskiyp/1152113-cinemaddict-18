import { createElement } from '../render';

const createContentDetailsConteinerTemplate = () => `
<section class="film-details"></section>
`;

export default class ContentDetailsConteinerView {
  #element = null;

  get template() {
    return createContentDetailsConteinerTemplate();
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
