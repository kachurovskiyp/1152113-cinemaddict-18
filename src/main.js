import MenuView from './view/menu-view';
import ProfileView from './view/profile-view';
import SortView from './view/sort-view';
import { render } from './render';
import ContentPresenter from './presenter/content-presenter';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(new ProfileView(), siteHeaderElement);
render(new MenuView(), siteMainElement);
render(new SortView(), siteMainElement);

const contentPresenter = new ContentPresenter;
contentPresenter.init(siteMainElement);
