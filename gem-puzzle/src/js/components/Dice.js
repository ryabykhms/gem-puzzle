export default class Dice {
  constructor(size, content, order, isEmpty) {
    this.dice = this._createDice(size, content, order, isEmpty);
  }

  _createDice(size, content, order, isEmpty) {
    const dice = document.createElement('div');
    dice.classList.add('dice');
    dice.style.width = `${size}%`;
    dice.style.height = `${size}%`;
    dice.textContent = content;
    dice.style.order = order;
    if (isEmpty) {
      dice.classList.add('dice--empty');
      dice.textContent = '';
    }
    return dice;
  }

  get dice() {
    return this._dice;
  }

  set dice(dice) {
    this._dice = dice;
  }
}
