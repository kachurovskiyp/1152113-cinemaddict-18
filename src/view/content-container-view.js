import AbstractView from '../framework/view/abstract-view.js';

const createNewContentContainerTemplate = () => `
  <section class="films"></section>
`;

export default class ContentContainerView extends AbstractView {
  get template() {
    return createNewContentContainerTemplate();
  }
}
