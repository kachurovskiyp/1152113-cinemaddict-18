import { generateComment } from '../mock/comments';
import Observable from '../framework/observable';

const COMMENTS_COUNT = 4;

// const USER_EVENT = {
//   'delete' : 'delete'
// };

export default class CommentsModel extends Observable {
  #comments = Array.from({length: COMMENTS_COUNT}, generateComment);

  get comments() {
    return this.#comments;
  }

  getCommentCount = (filmID) => this.#comments.filter((comment) => comment.id * 1 === filmID).length;
}
