import Board from './Board';
import Dice from './Dice';
import Menu from './Menu';
import Panel from './Panel';
import Screen from './Screen';

export default class Game {
  constructor() {
    this.time = 0;
    this.moves = 0;
    this.boardState = [];
    this.size = 4;
    this.timeInterval = null;
    this.winState = [];
    this.isPause = false;
    this._initScreen();
  }

  start(size) {
    this.size = size;
    this._clearScreen();
    this._stopTimer();
    this._initScreen(size);
    this._startTimer();
  }

  reload(size, moves, time, boardState) {
    this.boardState = boardState;
    this.time = time;
    this.moves = moves;
    this.size = size;
    this._clearScreen();
    this._initScreen(size, true);
  }

  _clearScreen() {
    this.screenObj.panel.remove();
    this.screenObj.board.remove();
  }

  _isSolutionExist(size, arr) {
    let inversion = 0;
    const isSizeEven = size % 2 === 0;
    arr.forEach((item, i, array) => {
      if (item) {
        for (let j = 0; j < i; ++j)
          if (array[j] > item) {
            inversion++;
          }
      } else {
        if (isSizeEven) {
          inversion += 1 + i / size;
        }
        inversion++;
      }
    });
    inversion = Math.round(inversion);
    const isInversionEven = inversion % 2 === 0;
    return (isSizeEven && isInversionEven) || (!isSizeEven && !isInversionEven);
  }

  _randomGeneration(size) {
    if (size === undefined) {
      size = 4;
    }
    const length = size ** 2;
    const current = [];
    let isFill = false;
    while (!isFill) {
      const rand = Math.round(Math.random() * (length - 1));
      if (!current.includes(rand)) {
        current.push(rand);
      }
      if (current.length === length) {
        if (this._isSolutionExist(size, current)) {
          isFill = true;
        } else {
          current.length = 0;
        }
      }
    }
    return current;
  }

  _handleMoves(e) {
    if (!this.isPause && !this._checkWin()) {
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
          this.moves++;
          [
            this.boardState[0][diceOrder - 1],
            this.boardState[0][emptyDiceOrder - 1],
          ] = [
            this.boardState[0][emptyDiceOrder - 1],
            this.boardState[0][diceOrder - 1],
          ];
          this.panelObj.movesValue.textContent = this.moves;
        }
      }
    }
  }

  _checkWin() {
    if (this.boardState[0].join() === this.winState[0].join()) {
      clearInterval(this.timeInterval);
      this._showWin();
      return true;
    }
    return false;
  }

  _showWin() {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time - minutes * 60;

    alert(
      `Ура! Вы решили головоломку за ${minutes}:${seconds} и ${this.moves} ходов`
    );
  }

  _isEmptyNear(order, emptyOrder, size) {
    const isOrderLeft = order === emptyOrder - 1;
    const isOrderRight = order === emptyOrder + 1;
    const isOrderAbove = order === emptyOrder - size;
    const isOrderBelow = order === emptyOrder + size;
    return isOrderAbove || isOrderBelow || isOrderLeft || isOrderRight;
  }

  _initScreen(size, isReload) {
    if (!isReload) {
      this._initBoardState(size);
      this.time = 0;
      this.moves = 0;
    }
    this._initWinState(size);
    const dices = this._initDices(size);
    this.boardObj = new Board(size, dices);
    // this.boardObj.board.addEventListener('click', this._handleMoves.bind(this));
    this.panelObj = new Panel();
    this.panelObj.movesValue.textContent = this.moves;
    this.panelObj.timeValue.textContent = this.time;
    const isMenuExists = this.menuObj !== undefined;
    if (!isMenuExists) {
      this.menuObj = new Menu();
    }
    this.screenObj = new Screen(
      this.menuObj.menu,
      this.panelObj.panel,
      this.boardObj.board
    );
    document.body.prepend(this.screenObj.screen);
  }

  _initWinState(boardSize) {
    const state = [];
    const length = boardSize ** 2;
    for (let i = 1; i < length; i++) {
      state.push(i);
    }
    state.push(0);
    this.winState.length = 0;
    this.winState.push(state);
  }

  _initBoardState(boardSize) {
    const state = this._randomGeneration(boardSize);
    this.boardState.length = 0;
    this.boardState.push(state);
  }

  _initDices(boardSize) {
    const dices = [];
    const diceSize = Math.round(100 / boardSize) - 2;
    const state = this.boardState[0];
    state.forEach((item, i) => {
      const dice = new Dice(diceSize, item, i + 1, item === 0).dice;
      dices.push(dice);
    });
    return dices;
  }

  _startTimer() {
    clearInterval(this.timeInterval);
    this.timeInterval = this._newTimer();
  }

  _newTimer() {
    return setInterval(() => {
      if (!this.isPause) {
        this.time++;
        this.panelObj.timeValue.textContent = this.time;
      }
    }, 1000);
  }

  _stopTimer() {
    clearInterval(this.timeInterval);
  }

  pause() {
    this.isPause = !this.isPause;
  }

  set moves(moves) {
    this._moves = moves;
  }

  get moves() {
    return this._moves;
  }

  set size(size) {
    this._size = size;
  }

  get size() {
    return this._size;
  }

  set boardState(boardState) {
    this._boardState = boardState;
  }

  get boardState() {
    return this._boardState;
  }
}
