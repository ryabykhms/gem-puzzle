import Modal from './Modal';
export default class GameController {
  constructor(game, storage, audio) {
    this.game = game;
    this.storage = storage;
    this.sizes = this._generateSizes();
    this.modal = undefined;
    this.size = 4;
    this.isPause = false;
    this.audio = audio;
    this.leaders = this._generateLeaders();
    this.name = 'Unknown';
    this.isAnimated = false;
    this.isGiveUp = false;
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
    if (!this.isPause && !this._isWin() && !this.isAnimated && !this.isGiveUp) {
      const puzzle = e.target;
      if (
        puzzle.classList.contains('puzzle') &&
        !puzzle.classList.contains('puzzle--empty')
      ) {
        const emptyPuzzle = document.querySelector('.puzzle--empty');
        const puzzleOrder = +puzzle.style.order;
        const emptyPuzzleOrder = +emptyPuzzle.style.order;
        if (this._isEmptyNear(puzzleOrder, emptyPuzzleOrder, this.size)) {
          this.audio.play();
          let translate = '';
          if (this._isOrderAbove(puzzleOrder, emptyPuzzleOrder, this.size)) {
            translate = { transform: `translateY(${puzzle.clientHeight}px)` };
          }
          if (this._isOrderBelow(puzzleOrder, emptyPuzzleOrder, this.size)) {
            translate = { transform: `translateY(-${puzzle.clientHeight}px)` };
          }
          if (this._isOrderLeft(puzzleOrder, emptyPuzzleOrder, this.size)) {
            translate = { transform: `translateX(${puzzle.clientWidth}px)` };
          }
          if (this._isOrderRight(puzzleOrder, emptyPuzzleOrder, this.size)) {
            translate = { transform: `translateX(-${puzzle.clientWidth}px)` };
          }
          this.isAnimated = true;
          const animate = puzzle.animate([translate], 500);
          animate.addEventListener('finish', (e) => {
            this._handleAnimationEnd(
              puzzle,
              emptyPuzzle,
              puzzleOrder,
              emptyPuzzleOrder
            );
            this.isAnimated = false;
          });
        }
      }
    }
  }

  _handleAnimationEnd(puzzle, emptyPuzzle, puzzleOrder, emptyPuzzleOrder) {
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
      this.leaders.push(...leaders);
    }

    const index = this.leaders.findIndex((item) => {
      return this.game.moves < item.moves;
    });
    return index !== -1;
  }

  _addLeader(name) {
    const leaders = this.storage.get('leaders');
    let position = 1;
    const index = this.leaders.findIndex(
      (item) => this.game.moves < item.moves
    );

    if (leaders) {
      this.leaders = leaders;
      position = leaders[index].position;
    }
    this.leaders = this.leaders.map((item, i, arr) => {
      if (i === index) {
        return {
          position: position,
          name: name || 'Unknown',
          moves: this.game.moves,
          time: this.game.time,
        };
      } else if (i > index) {
        arr[i - 1].position += 1;
        return arr[i - 1];
      } else {
        return item;
      }
    });
    this.storage.set('leaders', this.leaders);
  }

  _showWin() {
    const win = document.createElement('div');
    const winMessage = document.createElement('div');
    winMessage.classList.add('win__message');
    const resultTime = this.game.formatTimeFromSeconds(this.game.time);
    winMessage.textContent = `Ура! Вы решили головоломку за ${resultTime} и ${this.game.moves} ходов`;
    win.classList.add('win');
    win.append(winMessage);
    if (this._isLeaderResult()) {
      const winInputName = document.createElement('input');
      winInputName.classList.add('win__input');
      winInputName.addEventListener('change', this._handleWinInput.bind(this));
      const winLeaderSave = document.createElement('button');
      winLeaderSave.classList.add('button');
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
    const isOrderLeft = this._isOrderLeft(order, emptyOrder);
    const isOrderRight = this._isOrderRight(order, emptyOrder);
    const isOrderAbove = this._isOrderAbove(order, emptyOrder, size);
    const isOrderBelow = this._isOrderBelow(order, emptyOrder, size);
    return isOrderAbove || isOrderBelow || isOrderLeft || isOrderRight;
  }

  _isOrderLeft(order, emptyOrder) {
    return order === emptyOrder - 1;
  }

  _isOrderRight(order, emptyOrder) {
    return order === emptyOrder + 1;
  }

  _isOrderAbove(order, emptyOrder, size) {
    return order === emptyOrder - size;
  }

  _isOrderBelow(order, emptyOrder, size) {
    return order === emptyOrder + size;
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
    this.game.menuObj.giveUp.addEventListener(
      'click',
      this._handleGiveUp.bind(this)
    );
    this.game.boardObj.board.addEventListener(
      'click',
      this._handleMoves.bind(this)
    );

    this.game.boardObj.board.addEventListener(
      'animationend',
      this._handleAnimationEnd.bind(this)
    );
  }

  _handleGiveUp(e) {
    if (!this.isGiveUp) {
      this.isGiveUp = true;
      let counter = 0;
      this.game.boardObj.puzzles
        .sort((a, b) => {
          return +a.textContent - +b.textContent;
        })
        .forEach((puzzle, i, array) => {
          puzzle.style.transition = 'order 1s ease';
          if (puzzle.classList.contains('puzzle--empty')) {
            puzzle.style.order = array.length;
          } else {
            counter += puzzle.style.order != i ? 1 : 0;
            puzzle.style.order = i;
          }
        });

      counter++;
      let transitionCounter = 0;
      this.game.boardObj.board.addEventListener('transitionend', (e) => {
        transitionCounter++;
        if (e.propertyName == 'order' && counter === transitionCounter) {
          this.game.stopTimer();
          this.modal = new Modal('modal-end');
          const gameOver = document.createElement('div');
          gameOver.classList.add('game-over');
          gameOver.textContent = 'Game Over!';
          this.modal.buildModal(gameOver);
        }
      });
    }
  }

  _handleLeaders(e) {
    const table = document.createElement('table');
    table.classList.add('table-leaders');
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
        leader.time === Number.MAX_SAFE_INTEGER
          ? ''
          : this.game.formatTimeFromSeconds(leader.time);
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
    this.isGiveUp = false;
  }

  _handleNewGame(e) {
    this.modal = new Modal('new-modal');
    const form = document.createElement('form');
    form.classList.add('new-game__form');
    const newGameTitle = document.createElement('div');
    newGameTitle.classList.add('new-game__title');
    newGameTitle.textContent = 'Start New Game';
    const select = document.createElement('select');
    select.classList.add('new-game__select', 'new-game__board-size');
    this.isGiveUp = false;
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
    button.classList.add('button', 'button--accent', 'new-game__button');
    button.textContent = 'Start';
    button.addEventListener('click', this._handleStart.bind(this));
    form.append(newGameTitle, select, button);
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
    e.target.classList.toggle('button--active', this.isPause);
    if (this.isPause) {
      e.target.textContent = 'Resume';
    } else {
      e.target.textContent = 'Pause';
    }
  }
}
