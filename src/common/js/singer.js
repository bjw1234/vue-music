export default class Singer {
  constructor ({id, name}) {
    this.id = id;
    this.name = name;
    if (this._isSupportWebp()) {
      this.avatar = `http://y.gtimg.cn/music/photo_new/T001R150x150M000${this.id}.webp`;
    } else {
      this.avatar = `http://y.gtimg.cn/music/photo_new/T001R150x150M000${this.id}.jpg`;
    }
  }

  _isSupportWebp () {
    let isSWebp = !![].map && window.document.createElement('canvas')
      .toDataURL('image/webp').indexOf('data:image/webp') === 0;
    return isSWebp;
  }
}
