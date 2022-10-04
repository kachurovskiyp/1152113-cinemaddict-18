import AbstractView from '../framework/view/abstract-view.js';

const createFooterTemplate = () => `
<footer class="footer">
  <section class="footer__logo logo logo--smaller">Cinemaddict</section>
  <section class="footer__statistics">
    <span class="footer__films-count">0</span> movies inside
  </section>
</footer>`;

export default class FooterView extends AbstractView {
  get template() {
    return createFooterTemplate(this.filmsCount);
  }

  setFilmsCount(filmsCount) {
    this.element.querySelector('.footer__films-count').innerHTML = filmsCount;
  }

}
