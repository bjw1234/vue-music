export function disorder (array) {
  let arr = array.slice();
  for (let i = 0; i < arr.length; i++) {
    let random = _getRandom(0, i);
    arr[i] = [arr[random], arr[random] = arr[i]][0];
  }
  return arr;
}

/**
 * 左右都闭合
 * @param min
 * @param max
 * @private
 */
function _getRandom (min, max) {
  return (Math.random() * (max - min + 1) + min) | 0;
}

// 进入全屏
export function requestFullScreen () {
  let de = document.documentElement;
  if (de.requestFullScreen) {
    de.requestFullScreen();
  } else if (de.mozRequestFullScreen) {
    de.mozRequestFullScreen();
  } else if (de.webkitRequestFullScreen) {
    de.webkitRequestFullScreen();
  }
}

// 退出全屏
export function exitFullScreen () {
  let de = document;
  if (de.exitFullScreen) {
    de.exitFullScreen();
  } else if (de.mozCancelFullScreen) {
    de.mozCancelFullScreen();
  } else if (de.webkitExitFullscreen) {
    de.webkitExitFullscreen();
  }
}
