import {render} from './framework/render.js';
import MenuView from './view/menu-view';
import ProfileView from './view/profile-view';
import SortView from './view/sort-view';
import ContentPresenter from './presenter/content-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();


render(new ProfileView(), siteHeaderElement);
render(new MenuView(), siteMainElement);
render(new SortView(), siteMainElement);

const contentPresenter = new ContentPresenter;
contentPresenter.init(siteMainElement, filmsModel, commentsModel);
