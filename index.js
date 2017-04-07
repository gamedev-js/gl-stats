import bindWebGL from './lib/gl-bind';

let _css = `
  .glstats {
    position: absolute;
    z-index: 9999;

    padding: 5px;
    width: 150px;
    left: 5px;
    top: 5px;

    font-size: 10px;
    font-family: 'Roboto Condensed', tahoma, sans-serif;
    overflow: hidden;
    user-select: none;
    cursor: default;

    background: rgba(0, 0, 0, 0.6);
    border-radius: 3px;

  }

  .glstats-container {
    display: flex;
    flex-direction: column;
    color: #888;
    white-space: nowrap;
  }

  .glstats-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: left;
  }

  .flex-1 {
    flex: 1;
  }

  .right {
    text-align: right;
  }
`;

// add global style
let styleEL = document.createElement('style');
styleEL.type = 'text/css';
styleEL.textContent = _css;
document.head.appendChild(styleEL);

bindWebGL();

function _addItem(dom, name) {
  let itemEL = document.createElement('div');
  itemEL.className = 'glstats-item';

  let spanName = document.createElement('span');
  spanName.className = 'flex-1';
  spanName.textContent = name;

  let spanValue = document.createElement('span');
  spanValue.className = 'flex-1 right';

  let spanValueText = document.createTextNode('');
  spanValueText.nodeValue = 'n/a';

  itemEL.appendChild(spanName);
  itemEL.appendChild(spanValue);
  spanValue.appendChild(spanValueText);

  dom.appendChild(itemEL);

  return spanValueText;
}

export default class GLStats {
  constructor(dom, opts = {}) {
    this._root = document.createElement('div');
    this._root.className = 'glstats';

    let containerEL = document.createElement('div');
    containerEL.className = 'glstats-container';

    this._root.appendChild(containerEL);
      this._drawcalls = _addItem(containerEL, 'Draw Calls');

    dom.appendChild(this._root);
  }

  inspect (gl) {
    gl.__inspect();
    this._gl = gl;
  }

  reset () {
    let gli = this._gl.__gli;
    this._drawcalls.nodeValue = gli.totalDrawArraysCalls + gli.totalDrawElementsCalls;

    this._gl.__reset();
  }
}