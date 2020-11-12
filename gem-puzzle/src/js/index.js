import 'scss/style.scss';
import Game from './components/Game';
import GameController from './components/GameController';
import GameStorage from './components/GameStorage';

const game = new Game();
const storage = new GameStorage('localStorage');
const controller = new GameController(game, storage);
controller.init();
// const boarSize = 4;
// game.start(boarSize);
