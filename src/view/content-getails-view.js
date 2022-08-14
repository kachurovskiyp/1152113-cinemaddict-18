import { createElement } from '../render';

const createContentDetailsConteinerTemplate = () => `
<section class="film-details"></section>
`;

export default class NewContentDetailsConteinerView {
  getTemplate() {
    return createContentDetailsConteinerTemplate();
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
