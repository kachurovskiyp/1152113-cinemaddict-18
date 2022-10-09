import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { formatCommentDate, createEmotionElement, EMOTIONS, EVENT_NAME } from '../util';

const getComments = (comments) => {
  let commentsMarkup = '';
  comments.map((element) => {
    commentsMarkup = commentsMarkup.concat(`
    <li class="film-details__comment">
     <span class="film-details__comment-emoji">
       <img src="./images/emoji/${element.emotion}.png" width="55" height="55" alt="emoji-smile">
     </span>
     <div>
       <p class="film-details__comment-text">${element.comment}</p>
       <p class="film-details__comment-info">
         <span class="film-details__comment-author">${element.author}</span>
         <span class="film-details__comment-day">${formatCommentDate(element.date)}</span>
         <button type="button" class="film-details__comment-delete" id="${element.id}">Delete</button>
       </p>
     </div>
    </li>
    `);
  });
  return commentsMarkup;
};

const createContentCommentsTemplate = (comments, commentsCount) => `

<div class="film-details__bottom-container">
  <section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>
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

export default class ContentCommentsView extends AbstractStatefulView {
  #comments = [];
  #commentsCount = 0;
  #actualEmotion = null;
  #commentForm = this.element.querySelector('.film-details__new-comment');

  constructor(comments, commentsCount) {
    super();
    this.#comments = comments;
    this.#commentsCount = commentsCount;
    this.#setCommentsEmotionClickHandler();
    this.#disableCommentTextElement();
  }

  get template() {
    return createContentCommentsTemplate(this.#comments, this.#commentsCount);
  }

  get comment() {
    return {
      'comment' : this.element.querySelector('.film-details__comment-input').value,
      'emotion' : this.#actualEmotion
    };
  }

  #disableCommentTextElement = () => {
    this.element.querySelector('.film-details__comment-input').setAttribute('disabled', 'disabled');
  };

  #enableCommentTextElement = () => {
    this.element.querySelector('.film-details__comment-input').removeAttribute('disabled');
  };

  #setEmotion = (type) => {
    const container = this.element.querySelector('.film-details__add-emoji-label');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(createEmotionElement(type));
  };

  #setSelectedEmotion = (source) => {
    this.#actualEmotion = source.dataset.name;
    this.#setEmotion(this.#actualEmotion);
    this.#radioButtonSelect(source.dataset.name);
  };

  #radioButtonSelect = (type) => {
    this.element.querySelector(`#${type}`).setAttribute('checked', 'checked');
  };

  #commentsEmotionClickHandler = (evt) => {
    evt.preventDefault();
    if(evt.target.tagName === EVENT_NAME.img) {
      this.#setSelectedEmotion(evt.target.parentNode);
    } else if ((evt.target.tagName === EVENT_NAME.label)){
      this.#setSelectedEmotion(evt.target);
    }
    this.#enableCommentTextElement();
  };

  #setCommentsEmotionClickHandler = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#commentsEmotionClickHandler);
  };

  #unsetCommentsEmotionClickHandler = () => {
    this.element.querySelector('.film-details__emoji-list').removeEventListener('click', this.#commentsEmotionClickHandler);
  };

  #restoreHandlers = () => {
    this.#setCommentsEmotionClickHandler();
    this.setDeleteHandler();
  };

  #deleteHandler = (evt) => {
    evt.preventDefault();
    this._callback.delete(evt);
  };

  setDeleteHandler = (callback) => {
    if(!this._callback.delete){
      this._callback.delete = callback;
    }

    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => {
      button.addEventListener('click', this.#deleteHandler);
    });
  };

  #formSubmitHandler = (evt) => {
    this._callback.formSubmit(evt);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    document.addEventListener('keydown', this.#formSubmitHandler);
  };

  removeEventHandlers = () => {
    document.removeEventListener('keydown', this.#formSubmitHandler);
  };

  disableForm() {
    this.#unsetCommentsEmotionClickHandler();
    this.#disableCommentTextElement();
    this.#commentForm.querySelectorAll('input').forEach((input) => {
      input.setAttribute('disabled','disabled');
    });
  }

  resetCommentForm = () => {
    const container = this.element.querySelector('.film-details__add-emoji-label');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    this.element.querySelector('.film-details__comment-input').value = '';
    this.#disableCommentTextElement();
    this.#setCommentsEmotionClickHandler();
    this.#commentForm.querySelectorAll('input').forEach((input) => {
      input.removeAttribute('disabled');
    });
  };

  resetComments = (comments) => {
    const commentsContainer = this.element.querySelector('.film-details__comments-list');

    while(commentsContainer.firstChild) {
      commentsContainer.removeChild(commentsContainer.firstChild);
    }

    commentsContainer.innerHTML = getComments(comments);
    this.#restoreHandlers();
    this.#disableCommentTextElement();
  };

  setDeleting = (button) => {
    button.innerHTML = 'Deleting...';
    button.setAttribute('disabled', 'disabled');
  };

  resetState = (button) => {
    button.removeAttribute('disabled');
    button.innerHTML = 'Delete';
  };

  resetCommentsCount = (commentsCount) => {
    this.element.querySelector('.film-details__comments-count').innerHTML = commentsCount;
  };
}
