import Observable from '../framework/observable';

// const USER_EVENT = {
//   'delete' : 'delete'
// };

export default class CommentsModel extends Observable {
  #comments = [];
  #id = null;
  #apiService = null;

  constructor(apiService, id) {
    super();
    this.#apiService = apiService;
    this.#id = id;
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
}
