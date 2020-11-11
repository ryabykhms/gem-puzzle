import 'scss/style.scss';

let boardState = {
  dices: [],
  current: [],
};

const isSolutionExist = (size, arr) => {
  const length = size ** 2;
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
};

const randomGeneration = (size) => {
  const length = size ** 2;
  const current = [];
  let isFill = false;
  while (!isFill) {
    const rand = Math.round(Math.random() * (length - 1));
    if (!current.includes(rand)) {
      current.push(rand);
    }
    if (current.length === length) {
      if (isSolutionExist(size, current)) {
        isFill = true;
      } else {
        current.length = 0;
      }
    }
  }
  return current;
};

const createDices = (size) => {
  const dices = [];
  const diceCount = size ** 2;
  const diceSize = Math.round(100 / size) - 2;
  const emptyDiceIndex = diceCount - 1;
  const current = randomGeneration(size);
  current.forEach((item, i) => {
    const dice = document.createElement('div');
    dice.classList.add('dice');
    dice.textContent = item;
    dice.style.width = `${diceSize}%`;
    dice.style.height = `${diceSize}%`;
    dice.style.order = i + 1;
    if (item === 0) {
      dice.classList.add('dice--empty');
      dice.textContent = '';
    }
    dices.push(dice);
  });

  return { dices, current };
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
const { dices, current } = createDices(size);
screen.classList.add('screen');
panel.classList.add('panel');
board.classList.add('board');
board = appendMany(board, dices);

boardState = { dices, current };

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
