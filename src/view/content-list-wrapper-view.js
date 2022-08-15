import { createElement } from '../render';

const createContentListWrapperTemplate = () => `
  <div class="films-list__container"></div>
`;

export default class ContentListWrapperView {
  getTemplate() {
    return createContentListWrapperTemplate();
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
