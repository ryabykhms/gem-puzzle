export default class GameController {
  constructor(game) {
    this.game = game;
  }

  init() {
    this.game.start(4);
    this._createHandlers();
  }

  _createHandlers() {
    this.game.menuObj.newGame.addEventListener(
      'click',
      this._handleNewGame.bind(this)
    );
    this.game.menuObj.pause.addEventListener(
      'click',
      this._handlePause.bind(this)
    );
  }

  _handleNewGame(e) {
    console.log(e);
  }

  _handlePause(e) {
    this.game.pause();
  }
}
