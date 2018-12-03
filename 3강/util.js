const sel = v => document.querySelector(v);

const el = (tag, ...attr) => {
  const el = document.createElement(tag);
  let i = 0;

  while (i < attr.length) {
    const k = attr[i++],
          v = attr[i++];

    if (typeof el[k] === 'function') {
      el[k](...(Array.isArray(v) ? v : [v]));
    } else if (k[0] === '@') {
      el.style[k.substr(1)] = v;
    } else {
      el[k] = v;
    }    
  }  

  return el;
}