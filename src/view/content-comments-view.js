import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { formatCommentDate, createEmotionElement, EMOTIONS, EVENT_NAME } from '../util';

const getComments = (comments) => {
  const commentsArray = [];
  comments.forEach((element) => {
    commentsArray.push(`
     <li class="film-details__comment">
     <span class="film-details__comment-emoji">
       <img src="./images/emoji/${element[0].emotion}.png" width="55" height="55" alt="emoji-smile">
     </span>
     <div>
       <p class="film-details__comment-text">${element[0].comment}</p>
       <p class="film-details__comment-info">
         <span class="film-details__comment-author">${element[0].author}</span>
         <span class="film-details__comment-day">${formatCommentDate(element[0].date)}</span>
         <button class="film-details__comment-delete">Delete</button>
       </p>
     </div>
   </li>
     `);
  });
  return commentsArray.join(' ');
};

const createContentCommentsTemplate = (comments) => `

<div class="film-details__bottom-container">
  <section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>
    <ul class="film-details__comments-list">
    ${getComments(comments)}
    </ul>
    <form class="film-details__new-comment" action="" method="get">
      <div class="film-details__add-emoji-label"></div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>
      <div class="film-details__emoji-list">
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="${EMOTIONS.smile.name}" value="${EMOTIONS.smile.name}">
        <label class="film-details__emoji-label" for="${EMOTIONS.smile.name}" data-name="${EMOTIONS.smile.name}">
          <img src="${EMOTIONS.smile.src}" width="30" height="30" alt="emoji-${EMOTIONS.smile.name}">
        </label>
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="${EMOTIONS.sleeping.name}" value="${EMOTIONS.sleeping.name}">
        <label class="film-details__emoji-label" for="${EMOTIONS.sleeping.name}" data-name="${EMOTIONS.sleeping.name}">
          <img src="${EMOTIONS.sleeping.src}" width="30" height="30" alt="emoji-${EMOTIONS.sleeping.name}">
        </label>
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="${EMOTIONS.puke.name}" value="${EMOTIONS.puke.name}">
        <label class="film-details__emoji-label" for="${EMOTIONS.puke.name}" data-name="${EMOTIONS.puke.name}">
          <img src="${EMOTIONS.puke.src}" width="30" height="30" alt="emoji-${EMOTIONS.puke.name}">
        </label>
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="${EMOTIONS.angry.name}" value="${EMOTIONS.angry.name}">
        <label class="film-details__emoji-label" for="${EMOTIONS.angry.name}" data-name="${EMOTIONS.angry.name}">
          <img src="${EMOTIONS.angry.src}" width="30" height="30" alt="emoji-${EMOTIONS.angry.name}">
        </label>
      </div>
    </form>
  </section>
</div>
`;

export default class ContentCommentsInnerView extends AbstractStatefulView {
  constructor(comments) {
    super();
    this.comments = comments;
    this._setCommentsEmotionClickHandler();
  }

  get template() {
    return createContentCommentsTemplate(this.comments);
  }

  #setEmotion = (type) => {
    const container = this.element.querySelector('.film-details__add-emoji-label');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(createEmotionElement(type));
  };

  #setSelectedEmotion = (source) => {
    this.updateElement({'selectedEmotion' : source.dataset.name});
    this.#setEmotion(source.dataset.name);
    this.#selectRadioButton(source.dataset.name);
  };

  #selectRadioButton = (type) => {
    this.element.querySelector(`#${type}`).setAttribute('checked', 'checked');
  };

  #setCommentsEmotionClickHandler = (evt) => {
    evt.preventDefault();
    if(evt.target.tagName === EVENT_NAME.img) {
      this.#setSelectedEmotion(evt.target.parentNode);
    } else if ((evt.target.tagName === EVENT_NAME.label)){
      this.#setSelectedEmotion(evt.target);
    }
  };

  _setCommentsEmotionClickHandler() {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#setCommentsEmotionClickHandler);
  }

  _restoreHandlers = () => {
    this._setCommentsEmotionClickHandler();
  };
}
