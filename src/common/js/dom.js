let elementStyle = document.createElement('div').style;

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  };

  for (let key in transformNames) {
    let support = elementStyle[transformNames[key]] !== undefined;
    if (support) {
      return key;
    }
  }
  return false;
})();

export function prefixStyle (style) {
  if (vendor === false) {
    return style;
  }
  if (vendor === 'standard') {
    return style;
  }
  let result = vendor + style.charAt(0).toUpperCase() + style.substr(1);
  return result;
}
