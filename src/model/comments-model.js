import Observable from '../framework/observable';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class CommentsModel extends Observable {
  #comments = [];
  #id = null;
  #apiService = null;
  #uiBlocker = null;

  constructor(apiService, id) {
    super();
    this.#apiService = apiService;
    this.#id = id;
    this.#uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  }

  get comments() {
    return this.#comments;
  }

  init = async () => {
    try{
      this.#comments = await this.#apiService.getComments(this.#id);
      this._notify();

    } catch {
      this.#comments = [];
      throw new Error('Can\'t load comments');
    }
  };

  addComment = async (comment, errorCallback) => {
    this.#uiBlocker.block();

    try{
      const responce = await this.#apiService.addComment(comment, this.#id);
      this.#comments = responce.comments;

      this._notify();
    } catch {
      this.#uiBlocker.unblock();
      errorCallback();
      throw new Error('Can\'t add comment');
    }

    this.#uiBlocker.unblock();
  };

  deleteComment = async(commentButton, setDeleting, errorCallback) => {
    setDeleting(commentButton);

    try{
      await this.#apiService.deleteComment(commentButton.id);
    } catch {
      errorCallback(commentButton);
      throw new Error('Can\'t load comments');
    }
    this.#comments = this.#comments.filter((comment) => comment.id !== commentButton.id);

    this._notify();
  };
}
