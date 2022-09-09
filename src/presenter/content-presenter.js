import {render} from '../framework/render.js';
import ContentContainerView from '../view/content-container-view';
import ContentListContainerView from '../view/content-list-view';
import ContentListWrapperView from '../view/content-list-wrapper-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import ContentDetailsConteinerView from '../view/content-details-view';
import ContentDetailsInnerView from '../view/content-details-inner';
import ContentDetailsView from '../view/content-details';
import ContentCommentsInnerView from '../view/content-comments-view';
import ListEmptyView from '../view/list-empty-view';

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export default class ContentPresenter {
  FILMS_COUNT_PER_STEP = 5;
  contentContainer = new ContentContainerView();
  contentListContainer = new ContentListContainerView();
  contentWrapper = new ContentListWrapperView();
  contentDetailsContainer = new ContentDetailsConteinerView();
  contentDetailsInner = new ContentDetailsInnerView();
  showMoreButton = new ShowMoreButtonView();
  filmCardViews = [];


  #onMoreButtomClick = () => {
    this.filmCardViews
      .slice(this.FILMS_COUNT_PER_STEP, this.FILMS_COUNT_PER_STEP + this.FILMS_COUNT_PER_STEP)
      .forEach((film) => render(film, this.contentWrapper.element));

    this.FILMS_COUNT_PER_STEP += this.FILMS_COUNT_PER_STEP;

    if (this.FILMS_COUNT_PER_STEP >= this.filmCardViews.length) {
      this.showMoreButton.element.remove();
      this.showMoreButton.removeElement();
    }
  };

  #onContentClick = (evt) => {

    // Popup render
    const contentDetails = new ContentDetailsView(this.content, evt.target.parentNode.parentNode.id);

    render(this.contentDetailsContainer, this.contentPlace, RenderPosition.AFTEREND);
    render(this.contentDetailsInner, this.contentDetailsContainer.element);
    render(contentDetails, this.contentDetailsInner.element);
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
  };

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

    this.content.map((film) => {
      this.filmCardViews.push(new FilmCardView(film, this.comments.slice()));
    });

    if(this.filmCardViews.length < 1) {
      render(new ListEmptyView, this.contentWrapper.element);
    } else {
      for (let i = 0; i < Math.min(this.filmCardViews.length, this.FILMS_COUNT_PER_STEP); i++) {
        render(this.filmCardViews[i], this.contentWrapper.element);
      }

      this.contentWrapper.setClickHandler(this.#onContentClick);

      if(this.content.length > this.FILMS_COUNT_PER_STEP) {
        render(this.showMoreButton, this.contentListContainer.element);
        this.showMoreButton.setClickHandler(this.#onMoreButtomClick);
      }
    }
  }
}
