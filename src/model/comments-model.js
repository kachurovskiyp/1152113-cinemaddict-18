import { generateComment } from '../mock/comments';

const COMMENTS_COUNT = 4;

export default class CommentsModel {
  comments = Array.from({length: COMMENTS_COUNT}, generateComment);
  getComments = () => this.comments;
}
