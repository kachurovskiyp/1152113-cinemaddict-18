import NewContentContainerView from '../view/content-container-view';
import NewContentListContainerView from '../view/content-list-view';
import NewContentListWrapperView from '../view/content-list-wrapper-view';
import NewFilmCardView from '../view/film-card-view';
import NewShowMoreButtonView from '../view/show-more-button-view';
import NewContentDetailsConteinerView from '../view/content-getails-view';
import NewContentDetailsInnerView from '../view/content-details-inner';
import NewContentDetailsView from '../view/content-details';
import NewContentCommentsInnerView from '../view/content-comments-view';
import { render, RenderPosition } from '../render';

export default class ContentPresenter {
  contentContainer = new NewContentContainerView();
  contentListContainer = new NewContentListContainerView();
  contentWrapper = new NewContentListWrapperView();

  contentDetailsContainer = new NewContentDetailsConteinerView();
  contentDetailsInner = new NewContentDetailsInnerView();

  init (contentPlace) {
    this.contentPlace = contentPlace;

    // Film carsd render

    render(this.contentContainer, this.contentPlace);
    render(this.contentListContainer, this.contentContainer.getElement());
    render(this.contentWrapper, this.contentListContainer.getElement());

    for(let i = 0; i < 5; i++) {
      render(new NewFilmCardView(), this.contentWrapper.getElement());
    }

    render(new NewShowMoreButtonView(), this.contentListContainer.getElement());

    // Popup render

    render(this.contentDetailsContainer, this.contentPlace, RenderPosition.AFTEREND);
    render(this.contentDetailsInner, this.contentDetailsContainer.getElement());
    render(new NewContentDetailsView(), this.contentDetailsInner.getElement());
    render(new NewContentCommentsInnerView(), this.contentDetailsInner.getElement());
  }
}
