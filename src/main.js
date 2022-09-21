import {render} from './framework/render.js';
import ProfileView from './view/profile-view';
import ContentPresenter from './presenter/content-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

render(new ProfileView(), siteHeaderElement);

const contentPresenter = new ContentPresenter;
contentPresenter.init(siteMainElement, filmsModel, commentsModel);
