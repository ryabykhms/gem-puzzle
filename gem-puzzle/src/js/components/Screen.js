export default class Screen {
  constructor(panel, board) {
    this.panel = panel;
    this.board = board;
    this.screen = this._createScreen(panel, board);
  }

  _createScreen(panel, board) {
    const screen = document.createElement('div');
    screen.classList.add('screen');
    screen.append(panel, board);
    return screen;
  }

  get board() {
    return this._board;
  }

  set board(board) {
    this._board = board;
  }

  get panel() {
    return this._panel;
  }

  set panel(panel) {
    this._panel = panel;
  }

  get screen() {
    return this._screen;
  }

  set screen(screen) {
    this._screen = screen;
  }
}
