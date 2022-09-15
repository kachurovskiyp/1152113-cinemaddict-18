import {remove, render, RenderPosition} from '../framework/render.js';
import MenuView from '../view/menu-view';
import SortView from '../view/sort-view';
import ContentContainerView from '../view/content-container-view';
import ContentListContainerView from '../view/content-list-view';
import ContentListWrapperView from '../view/content-list-wrapper-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import ListEmptyView from '../view/list-empty-view';
import { filter } from '../mock/filter.js';

import { changeData } from '../util.js';

import FilmPresenter from './film-presenter.js';

export default class ContentPresenter {
  #FILMS_STEP = 5;
  #FILMS_COUNT_PER_STEP = this.#FILMS_STEP;

  #filmPresenters = [];

  #menuView = null;
  #listEmpty = new ListEmptyView;
  #contentContainer = new ContentContainerView();
  #contentListContainer = new ContentListContainerView();
  #contentWrapper = new ContentListWrapperView();
  #showMoreButton = new ShowMoreButtonView();

  #renderMenu = () => {
    this.#menuView = new MenuView(filter(this.content));
    render(this.#menuView, this.contentPlace);
  };

  #resetMenu = () => {
    remove(this.#menuView);
    this.#menuView = new MenuView(filter(this.content));
    render(this.#menuView, this.contentPlace, RenderPosition.BEFOREBEGIN);
  };

  #closeAllPopups = () => {
    this.#filmPresenters.forEach((filmPresenter) => filmPresenter.closePopup());
  };

  #changeHandler = (chagedID, type) => {
    this.content = changeData(this.content, chagedID, type);
    this.#clearFilmList();
    this.#renderFilms(this.content);
    this.#resetMenu();

    if(this.#filmPresenters.some((filmPresenter) => filmPresenter.popupOpened)){
      this.#filmPresenters.find((filmPresenter) => filmPresenter.id === chagedID).resetPopup();
    }
  };

  #clearFilmList () {
    this.#filmPresenters.forEach((filmPresenter) => filmPresenter.destroy());
    this.#FILMS_COUNT_PER_STEP = this.#FILMS_STEP;
    remove(this.#showMoreButton);
  }

  #renderFilms (films) {
    films.map((film) => {
      this.#filmPresenters.push(
        new FilmPresenter(film, this.comments.slice(), this.#changeHandler, this.#closeAllPopups, this.#contentWrapper.element)
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
  }

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

  init (contentPlace, filmsModel, commentsModel) {
    this.contentPlace = contentPlace;
    this.filmsModel = filmsModel;
    this.content = [...this.filmsModel.films];

    this.commentModel = commentsModel;
    this.comments = [...this.commentModel.comments];

    this.#renderMenu();
    render(new SortView(), this.contentPlace);

    this.#renderContentWrapper();
    this.#renderFilms(this.content);
  }
}
