import {render} from './framework/render.js';
import ProfileView from './view/profile-view';
import ContentPresenter from './presenter/content-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import FilmsApiService from './films-api-service.js';

const AUTHORIZATION = 'Basic xbCFBCUjHdI4usQm';
const END_POINT = 'https://18.ecmascript.pages.academy/cinemaddict';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel();

render(new ProfileView(), siteHeaderElement);

const contentPresenter = new ContentPresenter();
contentPresenter.init(siteMainElement, filmsModel, commentsModel);
filmsModel.init();
