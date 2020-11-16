import Modal from './Modal';
export default class GameController {
  constructor(game, storage) {
    this.game = game;
    this.storage = storage;
    this.sizes = this._generateSizes();
    this.modal = undefined;
    this.size = 4;
    this.isPause = false;
    this.leaders = this._generateLeaders();
    this.name = 'Unknown';
  }

  _generateLeaders() {
    let leaders = [];
    const leadersStorage = this.storage.get('leaders');
    if (leadersStorage) {
      leaders = leadersStorage;
    } else {
      for (let i = 1; i <= 10; i++) {
        leaders.push({
          position: i,
          name: 'empty',
          time: Number.MAX_SAFE_INTEGER,
          moves: Number.MAX_SAFE_INTEGER,
        });
      }
      this.storage.set('leaders', leaders);
    }
    return leaders;
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
      const puzzle = e.target;
      if (
        puzzle.classList.contains('puzzle') &&
        !puzzle.classList.contains('puzzle--empty')
      ) {
        const emptyPuzzle = document.querySelector('.puzzle--empty');
        const puzzleOrder = +puzzle.style.order;
        const emptyPuzzleOrder = +emptyPuzzle.style.order;
        if (this._isEmptyNear(puzzleOrder, emptyPuzzleOrder, this.size)) {
          puzzle.style.order = emptyPuzzleOrder;
          emptyPuzzle.style.order = puzzleOrder;
          this.game.moves++;
          [
            this.game.boardState[0][puzzleOrder - 1],
            this.game.boardState[0][emptyPuzzleOrder - 1],
          ] = [
            this.game.boardState[0][emptyPuzzleOrder - 1],
            this.game.boardState[0][puzzleOrder - 1],
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

  _isLeaderResult() {
    const leaders = this.storage.get('leaders');
    if (leaders) {
      this.leaders.push([...leaders]);
    }

    const index = this.leaders.findIndex((item) => {
      return this.game.moves < item.moves;
    });
    return index !== -1;
  }

  _addLeader(name) {
    const leaders = this.storage.get('leaders');
    if (leaders) {
      this.leaders.push([...leaders]);
    }
    const index = this.leaders.findIndex(
      (item) => this.game.moves < item.moves
    );
    this.leaders = this.leaders.map((item, i, arr) => {
      if (i === index) {
        return {
          position: leaders[index].position,
          name: name || 'Unknown',
          moves: this.game.moves,
          time: this.game.time,
        };
      } else if (i > index) {
        return arr[i - 1];
      } else {
        return item;
      }
    });
    this.storage.set('leaders', this.leaders);
  }

  _showWin() {
    const minutes = Math.floor(this.game.time / 60);
    const seconds = this.game.time - minutes * 60;

    const win = document.createElement('div');
    const winMessage = document.createElement('div');
    winMessage.classList.add('win__message');
    winMessage.textContent = `Ура! Вы решили головоломку за ${minutes}:${seconds} и ${this.game.moves} ходов`;
    win.classList.add('win');
    win.append(winMessage);
    if (this._isLeaderResult()) {
      const winInputName = document.createElement('input');
      winInputName.addEventListener('change', this._handleWinInput.bind(this));
      const winLeaderSave = document.createElement('button');
      winLeaderSave.textContent = 'Save';
      winLeaderSave.addEventListener('click', this._handleAddLeader.bind(this));
      win.append(winInputName);
      win.append(winLeaderSave);
    }
    this.modal = new Modal('win-modal');
    this.modal.buildModal(win);
  }

  _handleWinInput(e) {
    const winInputValue = e.target.value;
    this.name = winInputValue;
  }

  _handleAddLeader(e) {
    this._addLeader(this.name);
    this.modal.closeModal(e, true);
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
    this.game.menuObj.leaders.addEventListener(
      'click',
      this._handleLeaders.bind(this)
    );
    this.game.boardObj.board.addEventListener(
      'click',
      this._handleMoves.bind(this)
    );
  }

  _handleLeaders(e) {
    const table = document.createElement('table');
    const th = document.createElement('tr');
    const thPosition = document.createElement('th');
    thPosition.textContent = 'Position';
    const thName = document.createElement('th');
    thName.textContent = 'Name';
    const thTime = document.createElement('th');
    thTime.textContent = 'Time';
    const thMoves = document.createElement('th');
    thMoves.textContent = 'Moves';

    th.append(thPosition, thName, thTime, thMoves);
    table.append(th);

    this.leaders.forEach((leader) => {
      const tr = document.createElement('tr');
      const tdPosition = document.createElement('td');
      tdPosition.textContent = leader.position;
      const tdName = document.createElement('td');
      tdName.textContent = leader.name;
      const tdTime = document.createElement('td');
      tdTime.textContent =
        leader.time === Number.MAX_SAFE_INTEGER ? '' : leader.time;
      const tdMoves = document.createElement('td');
      tdMoves.textContent =
        leader.moves === Number.MAX_SAFE_INTEGER ? '' : leader.moves;
      tr.append(tdPosition, tdName, tdTime, tdMoves);
      table.append(tr);
    });

    this.modal = new Modal('modal-leaders');
    this.modal.buildModal(table);
  }

  _handleSave(e) {
    this.storage.set('last_game', {
      size: this.size,
      moves: this.game.moves,
      time: this.game.time,
      board: this.game.boardState,
      imageUrl: this.game.imageUrl,
    });
  }

  _handleLoad(e) {
    const { size, moves, time, board, imageUrl } = this.storage.get(
      'last_game'
    );
    this.game.reload(size, moves, time, board, imageUrl);
    this.size = size;
    this.game.boardObj.board.addEventListener(
      'click',
      this._handleMoves.bind(this)
    );
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
