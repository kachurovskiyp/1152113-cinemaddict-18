import { RenderPosition } from '../framework/render.js';
import ContentDetailsConteinerView from '../view/content-details-container-view';
import ContentDetailsInnerView from '../view/content-details-inner-view';
import ContentDetailsView from '../view/content-details-view';
import ContentCommentsInnerView from '../view/content-comments-view';
import {remove, render} from '../framework/render.js';
import FilmCardView from '../view/film-card-view';
import { FILTER, EVENT_NAME } from '../util.js';

export default class FilmPresenter {
  #id = null;
  #film = null;
  #filmView = null;
  #filmsModel = null;
  #closeAllPopups = null;
  #commentsModel = [];
  #contentPlace = null;
  #popupOpened = false;

  #contentDetailsContainer = new ContentDetailsConteinerView();
  #contentDetailsInner = new ContentDetailsInnerView();
  #contentDetails = null;
  #ContentCommentsInnerView = null;

  constructor(film, commentsModel, filmsModel, closeAllPopups, contentPlace) {
    this.#film = film;
    this.#filmsModel = filmsModel;
    this.#closeAllPopups = closeAllPopups;
    this.#id = film.id;
    this.#commentsModel = commentsModel;
    this.#contentPlace = contentPlace;
    this.#filmView = new FilmCardView(this.#film, this.#commentsModel);
    this.#contentDetails = new ContentDetailsView(this.#film, this.id);
    this.#ContentCommentsInnerView = new ContentCommentsInnerView(this.#commentsModel.comments);
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

  #popupRender = () => {
    this.#closeAllPopups();

    render(this.#contentDetailsContainer, this.#contentPlace, RenderPosition.AFTEREND);
    render(this.#contentDetailsInner, this.#contentDetailsContainer.element);
    render(this.#contentDetails, this.#contentDetailsInner.element);
    render(this.#ContentCommentsInnerView, this.#contentDetailsInner.element);

    this.#contentDetails.setClickHandler(this.closePopup);
    this.#contentDetails.setEscDownHandler(this.closePopup);
    this.#contentDetails.setWatchlistClickHandler(this.#onWatchListButtonClick);
    this.#contentDetails.setHistoryClickHandler(this.#onHistoryButtonClick);
    this.#contentDetails.setFavoriteClickHandler(this.#onFavoriteButtonClick);
    this.#popupOpened = true;
  };

  #onWatchListButtonClick = () => {
    this.#filmsModel.changeData(this.#id, FILTER.watchlist);
  };

  #onHistoryButtonClick = () => {
    this.#filmsModel.changeData(this.#id, FILTER.history);
  };

  #onFavoriteButtonClick = () => {
    this.#filmsModel.changeData(this.#id, FILTER.favorite);
  };
}
