import {remove, render} from '../framework/render.js';
import FilterMenuPresenter from './filter-presenter';
import ProfileView from '../view/profile-view';
import SortView from '../view/sort-view';
import ContentContainerView from '../view/content-container-view';
import ContentListView from '../view/content-list-view';
import ContentListWrapperView from '../view/content-list-wrapper-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import ListEmptyView from '../view/list-empty-view';
import FooterView from '../view/footer-view.js';
import { UPDATE_TYPE, SORT } from '../util.js';

import FilmPresenter from './film-presenter.js';

export default class ContentPresenter {
  #FILMS_STEP = 5;
  #FILMS_COUNT_PER_STEP = this.#FILMS_STEP;

  #filmPresenters = [];
  #filmsModel = null;
  #apiService = null;

  #filterMenu = null;
  #siteBodyElement = null;
  #siteHeaderElement = null;
  #userProfile = new ProfileView();
  #footer = new FooterView();
  #listEmpty = new ListEmptyView;
  #sortView = new SortView();
  #contentContainer = new ContentContainerView();
  #contentListContainer = new ContentListView();
  #contentWrapper = new ContentListWrapperView();
  #showMoreButton = new ShowMoreButtonView();

  constructor(apiService) {
    this.#apiService = apiService;
  }

  get films() {
    return this.#filmsModel.films;
  }

  init (siteBodyElement, siteHeaderElement, siteMainElement, filmsModel) {
    this.#siteBodyElement = siteBodyElement;
    this.#siteHeaderElement = siteHeaderElement;
    this.siteMainElement = siteMainElement;
    this.#filmsModel = filmsModel;

    render(this.#userProfile, this.#siteHeaderElement);

    this.#filterMenu = new FilterMenuPresenter(
      this.#filmsModel,
      this.siteMainElement,
      this.#renderFilms,
      this.#clearFilmList,
      this.#resetSort);
    this.#filterMenu.init();

    this.#renderFilms();
    this.#filmsModel.addObserver(this.#modelEventHandle);

    render(this.#footer, this.#siteBodyElement);
  }

  #sortHandler = (evt) => {
    this.#filmsModel.sortFilms(evt.target.dataset.sortType);
  };

  #resetSort = () => {
    this.#filmsModel.sortFilms(SORT.default);
    this.#sortView.updateElement({actualSort: SORT.default});
  };

  #modelEventHandle = (updateType, changedID) => {
    let newElement;
    const popupOpen = this.#filmPresenters.find((presenter) => presenter.popupOpened);
    let popupScrollPosition = 0.0;

    switch(updateType){
      case UPDATE_TYPE.INIT:
        this.#clearFilmList();
        this.#renderFilms();
        this.#footer.setFilmsCount(this.#filmsModel.films.length);
        this.#userProfile.setProfileRating(this.#filmsModel.films);
        break;

      case UPDATE_TYPE.PATCH:

        if(popupOpen){
          popupScrollPosition = popupOpen.popupScrollPosition;
          this.#closeAllPopups();
        }

        this.#filmPresenters = this.#filmPresenters.filter((filmPresenter) => filmPresenter.id !== changedID);

        this.#filmPresenters.push(
          new FilmPresenter(
            this.films.find((film) => film.id === changedID),
            this.#filmsModel,
            this.#filterMenu,
            this.#closeAllPopups,
            this.#contentWrapper.element,
            this.#apiService,
            this.#rerenderFilms,
          )
        );

        this.#filmPresenters.forEach((presenter) => {
          if(presenter.id === changedID) {
            presenter.setHandlers();
            newElement = presenter.viewComponent.element;
            if(popupOpen) {
              presenter.resetPopup(popupScrollPosition);
            }
          }
        });

        this.#contentWrapper.element.childNodes.forEach((child) => {
          if(parseInt(child.id, 10) === changedID) {
            this.#contentWrapper.element.replaceChild(newElement, child);
          }
        });

        this.#userProfile.setProfileRating(this.#filmsModel.films);
        break;
    }

  };

  #clearFilmList = () => {
    this.#filmPresenters.forEach((filmPresenter) => filmPresenter.destroy());
    this.#FILMS_COUNT_PER_STEP = this.#FILMS_STEP;
    this.#filmPresenters = [];

    remove(this.#sortView);
    this.#clearContentWrapper();
    remove(this.#showMoreButton);
    remove(this.#listEmpty);
  };

  #renderFilms = () => {
    const films = this.#filterMenu.filterItems(this.films);
    this.#filmPresenters = [];

    films.map((film) => {
      this.#filmPresenters.push(
        new FilmPresenter(
          film,
          this.#filmsModel,
          this.#filterMenu,
          this.#closeAllPopups,
          this.#contentWrapper.element,
          this.#apiService,
          this.#rerenderFilms
        )
      );
    });

    if(this.#filmPresenters.length < 1) {
      this.#renderContentWrapper();
      this.#renderListEmpty();

    } else {
      render(this.#sortView, this.siteMainElement);
      this.#sortView.setSortHandler(this.#sortHandler);

      this.#renderContentWrapper();

      this.#filmPresenters.slice(0, this.#FILMS_COUNT_PER_STEP).
        forEach((filmPresenter) => filmPresenter.init(this.#contentWrapper.element));

      if(films.length > this.#FILMS_COUNT_PER_STEP) {
        this.#renderShowMoreButton();
      }
    }
  };

  #rerenderFilms = () => {
    this.#clearFilmList();
    this.#renderFilms();
  };

  #moreButtonClickHandler = () => {
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
    this.#listEmpty.setActualFilter(this.#filterMenu.actualFilter);
    render(this.#listEmpty, this.#contentWrapper.element);
  }

  #renderContentWrapper() {
    render(this.#contentContainer, this.siteMainElement);
    render(this.#contentListContainer, this.#contentContainer.element);
    render(this.#contentWrapper, this.#contentListContainer.element);
  }

  #clearContentWrapper() {
    remove(this.#contentWrapper);
    remove(this.#contentListContainer);
    remove(this.#contentContainer);
  }

  #renderShowMoreButton () {
    render(this.#showMoreButton, this.#contentListContainer.element);
    this.#showMoreButton.setClickHandler(this.#moreButtonClickHandler);
  }

  #closeAllPopups = () => {
    this.#filmPresenters.forEach((filmPresenter) => filmPresenter.closePopup());
  };
}
