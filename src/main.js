import NewMenuView from './view/menu-view';
import NewProfileView from './view/profile-view';
import NewSortView from './view/sort-view';
import { render } from './render';
import ContentPresenter from './presenter/content-presenter';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(new NewProfileView(), siteHeaderElement);
render(new NewMenuView(), siteMainElement);
render(new NewSortView(), siteMainElement);

const contentPresenter = new ContentPresenter;
contentPresenter.init(siteMainElement);
