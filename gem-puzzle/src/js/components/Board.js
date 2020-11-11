export default class Board {
  constructor(size, dices) {
    this.size = size;
    this.dices = dices;
    this._createBoard();
  }

  _createBoard() {
    this.board = document.createElement('div');
    this.board.classList.add('board');
    this.dices.forEach((dice) => {
      this.board.append(dice);
    });
  }

  get board() {
    return this._board;
  }

  set board(board) {
    this._board = board;
  }
}
