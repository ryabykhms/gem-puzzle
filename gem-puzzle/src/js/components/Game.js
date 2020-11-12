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
    this.timeInterval = this._startTimer();
  }

  start(size) {
    this.size = size;
    this._stopTimer();
    this._initScreen(size);
    this._startTimer();
  }

  _isSolutionExist(size, arr) {
    let inversion = 0;
    arr.forEach((item, i, array) => {
      if (item) {
        for (let j = 0; j < i; ++j)
          if (array[j] > item) {
            inversion++;
          }
      } else {
        inversion += 1 + i / size;
      }
    });
    return !(inversion & 1);
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
        this.panelObj.movesValue.textContent = this.moves;
      }
    }
  }

  _isEmptyNear(order, emptyOrder, size) {
    const isOrderLeft = order === emptyOrder - 1;
    const isOrderRight = order === emptyOrder + 1;
    const isOrderAbove = order === emptyOrder - size;
    const isOrderBelow = order === emptyOrder + size;
    return isOrderAbove || isOrderBelow || isOrderLeft || isOrderRight;
  }

  _initScreen(size) {
    const { dices, state } = this._initDices(size);
    this.boardState.length = 0;
    this.boardState.push(state);
    this.boardObj = new Board(size, dices);
    this.boardObj.board.addEventListener('click', this._handleMoves.bind(this));
    this.panelObj = new Panel();
    this.menuObj = new Menu();
    this.screenObj = new Screen(
      this.menuObj.menu,
      this.panelObj.panel,
      this.boardObj.board
    );
    document.body.prepend(this.screenObj.screen);
  }

  _initDices(boardSize) {
    const dices = [];
    const diceSize = Math.round(100 / boardSize) - 2;
    const state = this._randomGeneration(boardSize);
    state.forEach((item, i) => {
      const dice = new Dice(diceSize, item, i + 1, item === 0).dice;
      dices.push(dice);
    });
    return { dices, state };
  }

  _startTimer() {
    clearInterval(this.timeInterval);
    this.timeInterval = this._startTimer();
  }

  _startTimer() {
    return setInterval(() => {
      this.time++;
      this.panelObj.timeValue.textContent = this.time;
    }, 1000);
  }

  _stopTimer() {
    clearInterval(this.timeInterval);
  }
}
