export default class Menu {
  constructor() {
    const {
      menu,
      newGame,
      pause,
      save,
      load,
      leaders,
      giveUp,
    } = this._createItems();
    this.menu = menu;
    this.newGame = newGame;
    this.pause = pause;
    this.save = save;
    this.load = load;
    this.leaders = leaders;
    this.giveUp = giveUp;
  }

  _createItems() {
    const menu = document.createElement('div');
    menu.classList.add('menu');
    const pause = document.createElement('button');
    pause.classList.add('menu__item', 'pause', 'button');
    pause.textContent = 'Pause';
    const newGame = document.createElement('button');
    newGame.classList.add('menu__item', 'new-game', 'button');
    newGame.textContent = 'New';
    const save = document.createElement('button');
    save.classList.add('menu__item', 'save', 'button');
    save.textContent = 'Save';
    const load = document.createElement('button');
    load.classList.add('menu__item', 'load', 'button');
    load.textContent = 'Load';
    const leaders = document.createElement('button');
    leaders.classList.add('menu__item', 'leaders', 'button');
    leaders.textContent = 'Leaders';
    const giveUp = document.createElement('button');
    giveUp.classList.add('menu__item', 'give-up', 'button');
    giveUp.textContent = 'Give Up';
    menu.append(newGame, pause, save, load, leaders, giveUp);
    return { menu, newGame, pause, save, load, leaders, giveUp };
  }

  get menu() {
    return this._menu;
  }

  set menu(menu) {
    this._menu = menu;
  }
}
