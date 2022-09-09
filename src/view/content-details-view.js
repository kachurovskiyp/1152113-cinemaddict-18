import AbstractView from '../framework/view/abstract-view.js';

const createContentDetailsConteinerTemplate = () => `
<section class="film-details"></section>
`;

export default class ContentDetailsConteinerView extends AbstractView {
  get template() {
    return createContentDetailsConteinerTemplate();
  }
}
