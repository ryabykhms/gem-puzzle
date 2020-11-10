import 'scss/style.scss';

const createDices = (size) => {
  const dices = [];
  const diceCount = size ** 2;
  const diceSize = Math.round(100 / size) - 2;
  const emptyDiceIndex = diceCount - 1;
  for (let i = 0; i < diceCount; i++) {
    const dice = document.createElement('div');
    dice.classList.add('dice');
    dice.textContent = i + 1;
    dice.style.width = `${diceSize}%`;
    dice.style.height = `${diceSize}%`;
    dice.style.order = i + 1;
    if (emptyDiceIndex === i) {
      dice.classList.add('dice--empty');
      dice.textContent = '';
    }
    dices.push(dice);
  }
  return dices;
};

const appendMany = (container, nodeArray) => {
  nodeArray.forEach((node) => {
    container.append(node);
  });
  return container;
};

const size = 4;
const body = document.querySelector('body');
const screen = document.createElement('div');
const panel = document.createElement('div');
let board = document.createElement('board');
const dices = createDices(size);
screen.classList.add('screen');
panel.classList.add('panel');
board.classList.add('board');
board = appendMany(board, dices);

const isEmptyNear = (order, emptyOrder, size) => {
  const isOrderLeft = order === emptyOrder - 1;
  const isOrderRight = order === emptyOrder + 1;
  const isOrderAbove = order === emptyOrder - size;
  const isOrderBelow = order === emptyOrder + size;
  return isOrderAbove || isOrderBelow || isOrderLeft || isOrderRight;
};

board.addEventListener('click', (e) => {
  const dice = e.target;
  if (
    dice.classList.contains('dice') &&
    !dice.classList.contains('dice--empty')
  ) {
    const emptyDice = document.querySelector('.dice--empty');
    const diceOrder = +dice.style.order;
    const emptyDiceOrder = +emptyDice.style.order;
    if (isEmptyNear(diceOrder, emptyDiceOrder, size)) {
      dice.style.order = emptyDiceOrder;
      emptyDice.style.order = diceOrder;
    }
  }
});
screen.append(panel);
screen.append(board);
body.prepend(screen);
