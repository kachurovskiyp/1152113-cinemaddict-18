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

const FILM_CARDS_COUNT = 5;

const filmCardViews = [...Array(FILM_CARDS_COUNT)].map(() => new FilmCardView());

export default class ContentPresenter {
  contentContainer = new ContentContainerView();
  contentListContainer = new ContentListContainerView();
  contentWrapper = new ContentListWrapperView();

  contentDetailsContainer = new ContentDetailsConteinerView();
  contentDetailsInner = new ContentDetailsInnerView();

  init (contentPlace) {
    this.contentPlace = contentPlace;

    // Film carsd render

    render(this.contentContainer, this.contentPlace);
    render(this.contentListContainer, this.contentContainer.getElement());
    render(this.contentWrapper, this.contentListContainer.getElement());

    filmCardViews.forEach((card) => {
      render(card, this.contentWrapper.getElement());
    });

    render(new ShowMoreButtonView(), this.contentListContainer.getElement());

    // Popup render

    render(this.contentDetailsContainer, this.contentPlace, RenderPosition.AFTEREND);
    render(this.contentDetailsInner, this.contentDetailsContainer.getElement());
    render(new ContentDetailsView(), this.contentDetailsInner.getElement());
    render(new ContentCommentsInnerView(), this.contentDetailsInner.getElement());
  }
}