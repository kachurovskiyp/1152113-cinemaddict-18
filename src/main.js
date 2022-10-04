import ContentPresenter from './presenter/content-presenter';
import FilmsModel from './model/films-model';
import FilmsApiService from './films-api-service.js';

const AUTHORIZATION = 'Basic xbCFBCUjHdI4usQm';
const END_POINT = 'https://18.ecmascript.pages.academy/cinemaddict';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteBodyElement = document.querySelector('body');
const apiService = new FilmsApiService(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel(apiService);

const contentPresenter = new ContentPresenter(apiService);
contentPresenter.init(siteBodyElement, siteHeaderElement, siteMainElement, filmsModel);

filmsModel.init();
