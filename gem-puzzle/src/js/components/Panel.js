export default class Panel {
  constructor() {
    const {
      panel,
      time,
      moves,
      pause,
      timeValue,
      movesValue,
    } = this._createPanel();
    this.panel = panel;
    this.time = time;
    this.moves = moves;
    this.pause = pause;
    this.timeValue = timeValue;
    this.movesValue = movesValue;
  }

  _createPanel() {
    const panel = document.createElement('div');
    const time = document.createElement('div');
    const timeTitle = document.createElement('span');
    const timeValue = document.createElement('span');
    const moves = document.createElement('div');
    const movesTitle = document.createElement('span');
    const movesValue = document.createElement('span');
    const pause = document.createElement('div');

    panel.classList.add('panel');
    time.classList.add('time');
    timeTitle.classList.add('time__title');
    timeValue.classList.add('time__value');
    moves.classList.add('moves');
    movesTitle.classList.add('moves__title');
    movesValue.classList.add('moves__value');
    pause.classList.add('pause');

    timeTitle.textContent = 'Time: ';
    timeValue.textContent = 0;
    movesTitle.textContent = 'Moves: ';
    movesValue.textContent = 0;
    pause.textContent = 'Pause';

    time.append(timeTitle, timeValue);
    moves.append(movesTitle, movesValue);
    panel.append(time, moves, pause);

    return { panel, time, moves, pause, timeValue, movesValue };
  }

  get panel() {
    return this._panel;
  }

  set panel(panel) {
    this._panel = panel;
  }

  get timeValue() {
    return this._timeValue;
  }

  set timeValue(timeValue) {
    this._timeValue = timeValue;
  }

  get movesValue() {
    return this._movesValue;
  }

  set movesValue(movesValue) {
    this._movesValue = movesValue;
  }
}
