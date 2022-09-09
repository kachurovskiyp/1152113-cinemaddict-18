import AbstractView from '../framework/view/abstract-view.js';

const createContentDetailsInnerTemplate = () => `
<div class="film-details__inner"></div>
`;

export default class ContentDetailsInnerView extends AbstractView {
  get template() {
    return createContentDetailsInnerTemplate();
  }
}
