import { createElement } from '../render';

const createNewContentContainerTemplate = () => `
  <section class="films"></section>
`;

export default class ContentContainerView {
  #element = null;

  get template() {
    return createNewContentContainerTemplate();
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
