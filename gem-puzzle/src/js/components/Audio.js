export default class Audio {
  constructor(src) {
    this.audio = this._generateAudio(src);
    document.body.prepend(this.audio);
  }

  _generateAudio(src) {
    const audio = document.createElement('audio');
    audio.src = src;
    return audio;
  }

  play() {
    this.audio.play();
  }
}
