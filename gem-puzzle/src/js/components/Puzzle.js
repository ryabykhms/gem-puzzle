export default class Puzzle {
  constructor(size, content, order, isEmpty) {
    this.puzzle = this._createPuzzle(size, content, order, isEmpty);
  }

  _createPuzzle(size, content, order, isEmpty) {
    const puzzle = document.createElement('div');
    puzzle.classList.add('puzzle');
    puzzle.style.width = `${size}%`;
    puzzle.style.height = `${size}%`;
    puzzle.textContent = content;
    puzzle.style.order = order;
    if (isEmpty) {
      puzzle.classList.add('puzzle--empty');
      puzzle.textContent = '';
    }
    return puzzle;
  }

  get puzzle() {
    return this._puzzle;
  }

  set puzzle(puzzle) {
    this._puzzle = puzzle;
  }
}
