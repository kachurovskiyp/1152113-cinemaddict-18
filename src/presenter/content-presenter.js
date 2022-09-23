import {remove, render} from '../framework/render.js';
import FilterMenuPresenter from './filter-presenter';
import SortView from '../view/sort-view';
import ContentContainerView from '../view/content-container-view';
import ContentListContainerView from '../view/content-list-view';
import ContentListWrapperView from '../view/content-list-wrapper-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import ListEmptyView from '../view/list-empty-view';
import { UPDATE_TYPE } from '../util.js';

import FilmPresenter from './film-presenter.js';

export default class ContentPresenter {
  #FILMS_STEP = 5;
  #FILMS_COUNT_PER_STEP = this.#FILMS_STEP;

  #filmPresenters = [];
  #filmsModel = null;
  #commentsModel = null;

  #filterMenu = null;
  #listEmpty = new ListEmptyView;
  #contentContainer = new ContentContainerView();
  #contentListContainer = new ContentListContainerView();
  #contentWrapper = new ContentListWrapperView();
  #showMoreButton = new ShowMoreButtonView();

  get films() {
    return this.#filmsModel.films;
  }

  #modelEventHandle = (updateType, changedID) => {
    let newElement;
    const popupOpen = this.#filmPresenters.find((presenter) => presenter.popupOpened);

    switch(updateType){
      case UPDATE_TYPE.INIT:
        this.#clearFilmList();
        this.#renderFilms();
        break;

      case UPDATE_TYPE.PATCH:
        if(popupOpen){
          this.#closeAllPopups();
        }

        this.#filmPresenters = this.#filmPresenters.filter((filmPresenter) => filmPresenter.id !== changedID);

        this.#filmPresenters.push(
          new FilmPresenter(
            this.films.find((film) => film.id * 1 === changedID * 1),
            this.#commentsModel,
            this.#filmsModel,
            this.#closeAllPopups,
            this.#contentWrapper.element
          )
        );

        this.#filmPresenters.forEach((presenter) => {
          if(presenter.id === changedID) {
            presenter.setHandlers();
            newElement = presenter.viewComponent.element;
            if(popupOpen) {
              presenter.resetPopup();
            }
          }
        });

        this.#contentWrapper.element.childNodes.forEach((child) => {
          if(child.id * 1 === changedID) {
            this.#contentWrapper.element.replaceChild(newElement, child);
          }
        });
        break;
    }
  };

  #clearFilmList = () => {
    this.#filmPresenters.forEach((filmPresenter) => filmPresenter.destroy());
    this.#FILMS_COUNT_PER_STEP = this.#FILMS_STEP;
    this.#filmPresenters = [];
    remove(this.#showMoreButton);
    remove(this.#listEmpty);
  };

  #renderFilms = () => {
    const films = this.#filterMenu.filterItems(this.films);
    this.#filmPresenters = [];

    films.map((film) => {
      this.#filmPresenters.push(
        new FilmPresenter(film, this.#commentsModel, this.#filmsModel, this.#closeAllPopups, this.#contentWrapper.element)
      );
    });

    if(this.#filmPresenters.length < 1) {
      this.#renderListEmpty();
    } else {
      this.#filmPresenters.slice(0, this.#FILMS_COUNT_PER_STEP).
        forEach((filmPresenter) => filmPresenter.init(this.#contentWrapper.element));

      if(films.length > this.#FILMS_COUNT_PER_STEP) {
        this.#renderShowMoreButton();
      }
    }
  };

  #onMoreButtomClick = () => {
    this.#filmPresenters
      .slice(this.#FILMS_COUNT_PER_STEP, this.#FILMS_COUNT_PER_STEP + this.#FILMS_COUNT_PER_STEP)
      .forEach((filmPresenter) => filmPresenter.init(this.#contentWrapper.element));

    this.#FILMS_COUNT_PER_STEP += this.#FILMS_COUNT_PER_STEP;

    if (this.#FILMS_COUNT_PER_STEP >= this.#filmPresenters.length) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };

  #renderListEmpty () {
    render(this.#listEmpty, this.#contentWrapper.element);
  }

  #renderContentWrapper() {
    render(this.#contentContainer, this.contentPlace);
    render(this.#contentListContainer, this.#contentContainer.element);
    render(this.#contentWrapper, this.#contentListContainer.element);
  }

  #renderShowMoreButton () {
    render(this.#showMoreButton, this.#contentListContainer.element);
    this.#showMoreButton.setClickHandler(this.#onMoreButtomClick);
  }

  #closeAllPopups = () => {
    this.#filmPresenters.forEach((filmPresenter) => filmPresenter.closePopup());
  };

  init (contentPlace, filmsModel, commentsModel) {
    this.contentPlace = contentPlace;
    this.#filmsModel = filmsModel;

    this.#commentsModel = commentsModel;

    this.#filterMenu = new FilterMenuPresenter(this.#filmsModel, this.contentPlace, this.#renderFilms, this.#clearFilmList);
    this.#filterMenu.init();
    render(new SortView(), this.contentPlace);

    this.#renderContentWrapper();
    this.#renderFilms();
    this.#filmsModel.addObserver(this.#modelEventHandle);
  }
}
