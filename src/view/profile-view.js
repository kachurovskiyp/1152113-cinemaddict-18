import AbstractView from '../framework/view/abstract-view.js';
import { USER_RATING } from '../util.js';

const createNewProfileTemplate = () => `
  <section class="header__profile profile">
    <p class="profile__rating"></p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
  `;

export default class ProfileView extends AbstractView {

  get template() {
    return createNewProfileTemplate();
  }

  #getUserRating = (filmsCount) => {
    if (!filmsCount) {
      return '';
    }else if(filmsCount < USER_RATING.fanCount) {
      return USER_RATING.novice;
    }else if(filmsCount < USER_RATING.movieBuffCount) {
      return USER_RATING.fan;
    }else if(filmsCount >= USER_RATING.movieBuffCount){
      return USER_RATING.movieBuff;
    }
  };

  setProfileRating(films) {
    const filmsCount = Object.keys(films.filter((film) => film.userDetails.alreadyWatched)).length;
    this.element.querySelector('.profile__rating').innerHTML = this.#getUserRating(filmsCount);
  }
}
