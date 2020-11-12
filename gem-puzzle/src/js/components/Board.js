export default class Board {
  constructor(size, puzzles) {
    this.size = size;
    this.puzzles = puzzles;
    this._createBoard();
  }

  _createBoard() {
    this.board = document.createElement('div');
    this.board.classList.add('board');
    this.puzzles.forEach((puzzle) => {
      this.board.append(puzzle);
    });
  }

  get board() {
    return this._board;
  }

  set board(board) {
    this._board = board;
  }
}
