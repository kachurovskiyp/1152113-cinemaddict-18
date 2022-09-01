import ContentContainerView from '../view/content-container-view';
import ContentListContainerView from '../view/content-list-view';
import ContentListWrapperView from '../view/content-list-wrapper-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import ContentDetailsConteinerView from '../view/content-details-view';
import ContentDetailsInnerView from '../view/content-details-inner';
import ContentDetailsView from '../view/content-details';
import ContentCommentsInnerView from '../view/content-comments-view';
import { render, RenderPosition } from '../render';

export default class ContentPresenter {
  contentContainer = new ContentContainerView();
  contentListContainer = new ContentListContainerView();
  contentWrapper = new ContentListWrapperView();

  contentDetailsContainer = new ContentDetailsConteinerView();
  contentDetailsInner = new ContentDetailsInnerView();

  init (contentPlace, filmsModel, commentsModel) {
    this.contentPlace = contentPlace;
    this.filmsModel = filmsModel;
    this.content = [...this.filmsModel.films];

    this.commentModel = commentsModel;
    this.comments = [...this.commentModel.comments];

    // Film carsd render

    render(this.contentContainer, this.contentPlace);
    render(this.contentListContainer, this.contentContainer.element);
    render(this.contentWrapper, this.contentListContainer.element);

    const filmCardViews = [];

    this.content.map((film) => {
      filmCardViews.push(new FilmCardView(film, this.comments.slice()));
    });

    filmCardViews.forEach((card) => {
      render(card, this.contentWrapper.element);
    });

    this.contentWrapper.element.addEventListener('click', (evt) => {

      // Popup render

      render(this.contentDetailsContainer, this.contentPlace, RenderPosition.AFTEREND);
      render(this.contentDetailsInner, this.contentDetailsContainer.element);
      render(new ContentDetailsView(this.content, evt.target.parentNode.parentNode.id), this.contentDetailsInner.element);
      render(new ContentCommentsInnerView(this.comments), this.contentDetailsInner.element);

      const closeButton = document.querySelector('.film-details__close-btn');

      const onCloseButtonClick = () => {
        closePopup();
      };

      const onEscButtonPress = (event) => {
        if (event.key === 'Escape' || event.key === 'Esc') {
          event.preventDefault();
          closePopup();
        }
      };

      function closePopup () {
        document.querySelector('.film-details').remove();
        closeButton.removeEventListener('click', onCloseButtonClick);
        document.removeEventListener('keydown', onEscButtonPress);
      }

      closeButton.addEventListener('click', onCloseButtonClick);
      document.addEventListener('keydown', onEscButtonPress);
    });
    render(new ShowMoreButtonView(), this.contentListContainer.element);
  }
}
