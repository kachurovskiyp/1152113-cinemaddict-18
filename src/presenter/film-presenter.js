import CommentsModel from '../model/comments-model';
import ContentDetailsConteinerView from '../view/content-details-container-view';
import ContentDetailsInnerView from '../view/content-details-inner-view';
import ContentDetailsView from '../view/content-details-view';
import ContentCommentsView from '../view/content-comments-view';
import FilmCardView from '../view/film-card-view';
import { remove, render } from '../framework/render.js';
import { RenderPosition } from '../framework/render.js';
import { FILTER, FILTER_NAME, EVENT_NAME, UPDATE_TYPE } from '../util.js';


export default class FilmPresenter {
  #id = null;
  #film = null;
  #filmView = null;
  #filmsModel = null;
  #closeAllPopups = null;
  #comments = [];
  #contentPlace = null;
  #popupOpened = false;
  #apiService = null;
  #commentsModel = null;
  #filterMenu = null;

  #contentDetailsContainer = new ContentDetailsConteinerView();
  #contentDetailsInner = new ContentDetailsInnerView();
  #contentDetails = null;
  #ContentCommentsView = null;

  constructor(film, filmsModel, filterMenu, closeAllPopups, contentPlace, apiService) {
    this.#film = film;
    this.#filmsModel = filmsModel;
    this.#filterMenu = filterMenu;
    this.#closeAllPopups = closeAllPopups;
    this.#contentPlace = contentPlace;
    this.#apiService = apiService;

    this.#id = film.id;
    this.#filmView = new FilmCardView(this.#film);
    this.#contentDetails = new ContentDetailsView(this.#film, this.id);
    this.#ContentCommentsView = new ContentCommentsView(this.#comments, film.comments.length);
  }

  get id () {
    return this.#id;
  }

  get popupOpened () {
    return this.#popupOpened;
  }

  get viewComponent () {
    return this.#filmView;
  }

  init (contentPlace) {
    render(this.#filmView, contentPlace);
    this.setHandlers();
    this.#ContentCommentsView.resetComments([]);
  }

  resetPopup = () => {
    this.#renderPopup();
  };

  closePopup = () => {
    this.#contentDetails.unsetPopupBodyClass();

    this.#contentDetails.removeEventHandlers();
    this.#ContentCommentsView.removeEventHandlers();

    remove(this.#contentDetails);
    remove(this.#ContentCommentsView);

    this.#popupOpened = false;
  };

  setHandlers() {
    this.#filmView.setWatchlistClickHandler(this.#watchListButtonClickHandler);
    this.#filmView.setHistoryClickHandler(this.#historyButtonClickHandler);
    this.#filmView.setFavoriteClickHandler(this.#favoriteButtonClickHandler);
    this.#filmView.setClickHandler(this.#filmClickHandler);
  }

  destroy = () => {
    remove(this.#filmView);
  };

  #filmClickHandler = (evt) => {
    if(evt.target.tagName !== EVENT_NAME.button) {
      this.#renderPopup();
    }
  };

  #deleteErrorHandler = (button) => {
    this.#ContentCommentsView.shake();
    this.#ContentCommentsView.resetState(button);
  };

  #deleteHandler = (evt) => {
    this.#commentsModel.deleteComment(
      evt.target,
      this.#ContentCommentsView.setDeleting,
      this.#deleteErrorHandler);
  };

  #submitErrorHandler = () => {
    this.#ContentCommentsView.shake();
  };

  #submitHandler = (evt) => {
    const metaKey = evt.ctrlKey || evt.metaKey;

    if(metaKey && evt.key === 'Enter') {
      const comment = this.#ContentCommentsView.comment;

      if(comment.emotion) {
        this.#ContentCommentsView.disableForm();
        this.#commentsModel.addComment(comment, this.#submitErrorHandler);
        this.#ContentCommentsView.resetCommentForm();
      }
    }
  };

  #renderPopup = () => {
    this.#closeAllPopups();

    render(this.#contentDetailsContainer, this.#contentPlace, RenderPosition.AFTEREND);
    render(this.#contentDetailsInner, this.#contentDetailsContainer.element);
    render(this.#contentDetails, this.#contentDetailsInner.element);
    render(this.#ContentCommentsView, this.#contentDetailsInner.element);
    this.#ContentCommentsView.setDeleteHandler(this.#deleteHandler);
    this.#ContentCommentsView.setFormSubmitHandler(this.#submitHandler);

    // this.#contentDetails.setScrollEvent();
    this.#contentDetails.setPopupBodyClass();
    this.#contentDetails.setClickHandler(this.closePopup);
    this.#contentDetails.setEscDownHandler(this.closePopup);
    this.#contentDetails.setWatchlistClickHandler(this.#watchListButtonClickHandler);
    this.#contentDetails.setHistoryClickHandler(this.#historyButtonClickHandler);
    this.#contentDetails.setFavoriteClickHandler(this.#favoriteButtonClickHandler);
    this.#popupOpened = true;

    this.#commentsModel = new CommentsModel(this.#apiService, this.id);
    this.#commentsModel.addObserver(this.#commentsChangeHandler);
    this.#commentsModel.init();
  };

  #buttonClickErrorHandler = () => {
    this.#filmView.shake();
  };

  #watchListButtonClickHandler = () => {
    this.#filmsModel.changeData(this.#id, FILTER.watchlist, this.#buttonClickErrorHandler);
    this.#checkActualFilter(FILTER_NAME.watchlist);
  };

  #historyButtonClickHandler = () => {
    this.#filmsModel.changeData(this.#id, FILTER.history, this.#buttonClickErrorHandler);
    this.#checkActualFilter(FILTER_NAME.history);
  };

  #favoriteButtonClickHandler = () => {
    this.#filmsModel.changeData(this.#id, FILTER.favorite, this.#buttonClickErrorHandler);
    this.#checkActualFilter(FILTER_NAME.favorites);
  };

  #checkActualFilter(filterName) {
    if(this.#filterMenu.actualFilter === filterName){
      this.destroy();
    }
  }

  #commentsChangeHandler = (updateType) => {
    switch(updateType){
      case UPDATE_TYPE.INIT:
        this.#ContentCommentsView.resetComments(this.#commentsModel.comments);
        break;
      case UPDATE_TYPE.PATCH:
        this.#filmView.resetCommentsCount(this.#commentsModel.comments.length);
        this.#ContentCommentsView.resetCommentsCount(this.#commentsModel.comments.length);
        this.#ContentCommentsView.resetComments(this.#commentsModel.comments);
    }
  };
}
