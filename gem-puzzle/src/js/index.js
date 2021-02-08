import 'scss/style.scss';
import Game from './components/Game';
import GameController from './components/GameController';
import GameStorage from './components/GameStorage';

const audio = new Audio('../assets/sounds/click.wav');
const game = new Game();
const storage = new GameStorage('localStorage');
const controller = new GameController(game, storage, audio);
controller.init();
