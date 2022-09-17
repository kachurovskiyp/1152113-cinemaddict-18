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
  #changeData = null;
  #closeAllPopups = null;
  #comments = [];
  #contentPlace = null;
  #popupOpened = false;

  #contentDetailsContainer = new ContentDetailsConteinerView();
  #contentDetailsInner = new ContentDetailsInnerView();
  #contentDetails = null;
  #ContentCommentsInnerView = null;

  constructor(film, comments, changeData, closeAllPopups, contentPlace) {
    this.#film = film;
    this.#changeData = changeData;
    this.#closeAllPopups = closeAllPopups;
    this.#id = film.id;
    this.#comments = comments;
    this.#contentPlace = contentPlace;
    this.#filmView = new FilmCardView(this.#film, this.#comments.slice());
  }

  #onFilmClick = (evt) => {
    if(evt.target.tagName !== EVENT_NAME.button) {
      this.#popupRender();
    }
  };

  #popupRender = () => {
    this.#closeAllPopups();
    this.#contentDetails = new ContentDetailsView(this.#film, this.#id);
    this.#ContentCommentsInnerView = new ContentCommentsInnerView(this.#comments);

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

  closePopup = () => {
    remove(this.#contentDetails);
    remove(this.#ContentCommentsInnerView);
    this.#popupOpened = false;
  };

  #onWatchListButtonClick = () => {
    this.#changeData(this.#id, FILTER.watchlist);
  };

  #onHistoryButtonClick = () => {
    this.#changeData(this.#id, FILTER.history);
  };

  #onFavoriteButtonClick = () => {
    this.#changeData(this.#id, FILTER.favorite);
  };

  resetPopup = () => {
    this.closePopup();
    this.#popupRender();
  };

  get popupOpened () {
    return this.#popupOpened;
  }

  get id () {
    return this.#id;
  }

  init (contentPlace) {
    render(this.#filmView, contentPlace);
    this.#filmView.setWatchlistClickHandler(this.#onWatchListButtonClick);
    this.#filmView.setHistoryClickHandler(this.#onHistoryButtonClick);
    this.#filmView.setFavoriteClickHandler(this.#onFavoriteButtonClick);
    this.#filmView.setClickHandler(this.#onFilmClick);
  }

  destroy = () => {
    remove(this.#filmView);
  };
}
