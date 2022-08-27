import { createElement } from '../render';

const createContentDetailsInnerTemplate = () => `
<div class="film-details__inner"></div>
`;

export default class ContentDetailsInnerView {
  getTemplate() {
    return createContentDetailsInnerTemplate();
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
