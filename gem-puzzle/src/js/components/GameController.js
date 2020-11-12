import Modal from './Modal';
export default class GameController {
  constructor(game, storage) {
    this.game = game;
    this.storage = storage;
    this.sizes = this._generateSizes();
    this.modal = undefined;
    this.size = 4;
    this.isPause = false;
  }

  _generateSizes() {
    const sizes = [];
    const sizeMax = 8;
    const sizeMin = 3;
    for (let i = sizeMin; i <= sizeMax; i++) {
      sizes.push({
        text: `${i}x${i}`,
        value: i,
      });
    }
    return sizes;
  }

  init() {
    this.game.start(4);
    this._createHandlers();
  }

  _handleMoves(e) {
    if (!this.isPause && !this._isWin()) {
      const dice = e.target;
      if (
        dice.classList.contains('dice') &&
        !dice.classList.contains('dice--empty')
      ) {
        const emptyDice = document.querySelector('.dice--empty');
        const diceOrder = +dice.style.order;
        const emptyDiceOrder = +emptyDice.style.order;
        if (this._isEmptyNear(diceOrder, emptyDiceOrder, this.size)) {
          dice.style.order = emptyDiceOrder;
          emptyDice.style.order = diceOrder;
          this.game.moves++;
          [
            this.game.boardState[0][diceOrder - 1],
            this.game.boardState[0][emptyDiceOrder - 1],
          ] = [
            this.game.boardState[0][emptyDiceOrder - 1],
            this.game.boardState[0][diceOrder - 1],
          ];
          this.game.panelObj.movesValue.textContent = this.game.moves;
          this._checkWin();
        }
      }
    }
  }

  _isWin() {
    return this.game.boardState[0].join() === this.game.winState[0].join();
  }

  _checkWin() {
    if (this._isWin()) {
      clearInterval(this.game.timeInterval);
      this._showWin();
      return true;
    }
    return false;
  }

  _showWin() {
    const minutes = Math.floor(this.game.time / 60);
    const seconds = this.game.time - minutes * 60;

    alert(
      `Ура! Вы решили головоломку за ${minutes}:${seconds} и ${this.game.moves} ходов`
    );
  }

  _isEmptyNear(order, emptyOrder, size) {
    const isOrderLeft = order === emptyOrder - 1;
    const isOrderRight = order === emptyOrder + 1;
    const isOrderAbove = order === emptyOrder - size;
    const isOrderBelow = order === emptyOrder + size;
    return isOrderAbove || isOrderBelow || isOrderLeft || isOrderRight;
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
    this.game.menuObj.save.addEventListener(
      'click',
      this._handleSave.bind(this)
    );
    this.game.menuObj.load.addEventListener(
      'click',
      this._handleLoad.bind(this)
    );
    this.game.boardObj.board.addEventListener(
      'click',
      this._handleMoves.bind(this)
    );
  }

  _handleSave(e) {
    this.storage.set('last_game', {
      size: this.size,
      moves: this.game.moves,
      time: this.game.time,
      board: this.game.boardState,
    });
  }

  _handleLoad(e) {
    const { size, moves, time, board } = this.storage.get('last_game');
    this.game.reload(size, moves, time, board);
    this.size = size;
  }

  _handleNewGame(e) {
    this.modal = new Modal('new-modal');
    const form = document.createElement('form');
    const select = document.createElement('select');
    this.sizes.forEach((size) => {
      const option = document.createElement('option');
      option.value = size.value;
      option.text = size.text;
      select.append(option);
    });
    select.options[0].selected = true;
    const obj = {
      target: select,
    };
    this._handleSizes(obj);
    select.addEventListener('change', this._handleSizes.bind(this));
    const button = document.createElement('button');
    button.textContent = 'Start';
    button.addEventListener('click', this._handleStart.bind(this));
    form.append(select, button);
    this.modal.buildModal(form);
  }

  _handleSizes(e) {
    const select = e.target;
    const index = select.options.selectedIndex;
    this.size = +select.options[index].value;
  }

  _handleStart(e) {
    e.preventDefault();
    if (this.modal !== undefined) {
      this.modal.closeModal(e, true);
      this.game.start(this.size);
      this.game.boardObj.board.addEventListener(
        'click',
        this._handleMoves.bind(this)
      );
    }
  }

  _handlePause(e) {
    this.game.pause();
    this.isPause = !this.isPause;
  }
}
