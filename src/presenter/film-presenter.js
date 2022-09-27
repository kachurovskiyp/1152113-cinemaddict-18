import CommentsModel from '../model/comments-model';
import ContentDetailsConteinerView from '../view/content-details-container-view';
import ContentDetailsInnerView from '../view/content-details-inner-view';
import ContentDetailsView from '../view/content-details-view';
import ContentCommentsInnerView from '../view/content-comments-view';
import FilmCardView from '../view/film-card-view';
import {remove, render} from '../framework/render.js';
import { RenderPosition } from '../framework/render.js';
import { FILTER, EVENT_NAME } from '../util.js';


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

  #contentDetailsContainer = new ContentDetailsConteinerView();
  #contentDetailsInner = new ContentDetailsInnerView();
  #contentDetails = null;
  #ContentCommentsInnerView = null;

  constructor(film, filmsModel, closeAllPopups, contentPlace, apiService) {
    this.#film = film;
    this.#filmsModel = filmsModel;
    this.#closeAllPopups = closeAllPopups;
    this.#contentPlace = contentPlace;
    this.#apiService = apiService;

    this.#id = film.id;
    this.#filmView = new FilmCardView(this.#film);
    this.#contentDetails = new ContentDetailsView(this.#film, this.id);
    this.#ContentCommentsInnerView = new ContentCommentsInnerView(this.#comments, film.comments.length);
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
    this.#ContentCommentsInnerView.resetComments([]);
  }

  resetPopup = () => {
    this.#popupRender();
  };

  closePopup = () => {
    remove(this.#contentDetails);
    remove(this.#ContentCommentsInnerView);
    this.#popupOpened = false;
  };

  setHandlers() {
    this.#filmView.setWatchlistClickHandler(this.#onWatchListButtonClick);
    this.#filmView.setHistoryClickHandler(this.#onHistoryButtonClick);
    this.#filmView.setFavoriteClickHandler(this.#onFavoriteButtonClick);
    this.#filmView.setClickHandler(this.#onFilmClick);
  }

  destroy = () => {
    remove(this.#filmView);
  };

  #onFilmClick = (evt) => {
    if(evt.target.tagName !== EVENT_NAME.button) {
      this.#popupRender();
    }
  };

  #onDeleteError = (button) => {
    this.#ContentCommentsInnerView.shake();
    this.#ContentCommentsInnerView.resetState(button);
  };

  #deleteHandler = (evt) => {
    this.#commentsModel.deleteComment(
      evt.target,
      this.#ContentCommentsInnerView.setDeleting,
      this.#onDeleteError);
  };

  #onSubmitError = () => {
    this.#ContentCommentsInnerView.shake();
  };

  #submitHandler = (evt) => {
    if(evt.ctrlKey && evt.key === 'Enter') {
      const comment = this.#ContentCommentsInnerView.comment;

      if(comment.emotion) {
        this.#commentsModel.addComment(comment, this.#onSubmitError);
        this.#ContentCommentsInnerView.resetCommentForm();
      }
    }
  };

  #popupRender = () => {
    this.#closeAllPopups();

    render(this.#contentDetailsContainer, this.#contentPlace, RenderPosition.AFTEREND);
    render(this.#contentDetailsInner, this.#contentDetailsContainer.element);
    render(this.#contentDetails, this.#contentDetailsInner.element);
    render(this.#ContentCommentsInnerView, this.#contentDetailsInner.element);

    this.#ContentCommentsInnerView.setDeleteHandler(this.#deleteHandler);
    this.#ContentCommentsInnerView.setFormSubmitHandler(this.#submitHandler);

    this.#contentDetails.setClickHandler(this.closePopup);
    this.#contentDetails.setEscDownHandler(this.closePopup);
    this.#contentDetails.setWatchlistClickHandler(this.#onWatchListButtonClick);
    this.#contentDetails.setHistoryClickHandler(this.#onHistoryButtonClick);
    this.#contentDetails.setFavoriteClickHandler(this.#onFavoriteButtonClick);
    this.#popupOpened = true;

    this.#commentsModel = new CommentsModel(this.#apiService, this.id);
    this.#commentsModel.addObserver(this.#commentsChangeHandler);
    this.#commentsModel.init();
  };

  #onButtonClickError = () => {
    this.#filmView.shake();
  };

  #onWatchListButtonClick = () => {
    this.#filmsModel.changeData(this.#id, FILTER.watchlist, this.#onButtonClickError);
  };

  #onHistoryButtonClick = () => {
    this.#filmsModel.changeData(this.#id, FILTER.history, this.#onButtonClickError);
  };

  #onFavoriteButtonClick = () => {
    this.#filmsModel.changeData(this.#id, FILTER.favorite, this.#onButtonClickError);
  };

  #commentsChangeHandler = () => {
    this.#ContentCommentsInnerView.resetComments(this.#commentsModel.comments);
  };
}
