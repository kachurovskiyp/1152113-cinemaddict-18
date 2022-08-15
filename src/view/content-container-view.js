import { createElement } from '../render';

const createNewContentContainerTemplate = () => `
  <section class="films"></section>
`;

export default class ContentContainerView {
  getTemplate() {
    return createNewContentContainerTemplate();
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
