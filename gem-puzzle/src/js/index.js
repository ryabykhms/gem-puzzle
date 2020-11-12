import 'scss/style.scss';
import Game from './components/Game';
import GameController from './components/GameController';

const game = new Game();
const controller = new GameController(game);
controller.init();
// const boarSize = 4;
// game.start(boarSize);
