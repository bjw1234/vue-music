import { getSongVkey, getSongURL, getLyrics } from 'api/song';
import { ERR_OK } from 'api/config';

export class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
  }

  // 获取歌曲url的方法
  getSongUrl () {
    if (this.url) {
      return Promise.resolve(this.url);
    }
    return getSongVkey(this.mid).then((res) => {
      if (res.code === ERR_OK) {
        if (res.data.items.length > 0) {
          let vkey = res.data.items[0].vkey;
          let currentSongUrl = getSongURL(this.mid, vkey);
          this.url = currentSongUrl;
          return Promise.resolve(currentSongUrl);
        }
      }
    });
  }

  // 获取歌曲的歌词
  getLyrics () {
    if (this.lyrics) {
      return Promise.resolve(this.lyrics);
    }
    return getLyrics(this.id).then(res => {
      if (res && res.data.code === ERR_OK) {
        let lyrics = _decodeLyrics(res.data.lyric);
        this.lyrics = lyrics;
        return Promise.resolve(lyrics);
      }
    });
  }
}

function _decodeLyrics (lyrics) {
  let div = document.createElement('div');
  div.innerHTML = lyrics;
  return div.innerHTML;
}

// 工厂方法，创建歌曲对象
export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: _filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
  });
}

// 如果有多个歌手名，则用/隔开
function _filterSinger (singer) {
  let ret = [];
  singer.forEach(s => ret.push(s.name));
  return ret.join('/');
}
