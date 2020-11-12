import Modal from './Modal';
export default class GameController {
  constructor(game, storage) {
    this.game = game;
    this.storage = storage;
    this.sizes = this._generateSizes();
    this.modal = undefined;
    this.size = 4;
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
      console.log(this.size);
      this.game.start(this.size);
    }
  }

  _handlePause(e) {
    this.game.pause();
  }
}
