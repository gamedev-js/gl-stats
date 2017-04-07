
/*
 * gl-stats v1.0.0
 * (c) 2017 @Johnny Wu
 * Released under the MIT License.
 */

var GLStats = (function () {
'use strict';

let glifuncs = {
  // default(original, name, ...args) {
  //   // this.__gli.callStack.push(name, args);
  //   // this.__gli.histogram.add(name);
  //   let ret = original.apply(this, args);
  //   // this.__gli.callStack.update(name);
  //   return ret;
  // },

  drawArrays (original, name, ...args) {
    if (this.__gli) {
      ++this.__gli.totalDrawArraysCalls;
    }
    return original.apply(this, args);
  },

  drawElements (original, name, ...args) {
    if (this.__gli) {
      ++this.__gli.totalDrawElementsCalls;
    }
    return original.apply(this, args);
  },
};

function _gliBind(name, origFn, newFn) {
  return function () {
    return newFn.apply(this, [origFn, name, ...arguments]);
  };
}

function bindWebGL() {
  // DISABLE
  // for (let name in WebGLRenderingContext.prototype) {
  //   try {
  //     if (typeof WebGLRenderingContext.prototype[name] !== 'function') {
  //       continue;
  //     }

  //     let newFunc = glifuncs[name] || glifuncs.default;
  //     WebGLRenderingContext.prototype[name] = _gliBind(name, WebGLRenderingContext.prototype[name], newFunc);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  for (let name in glifuncs) {
    let newFunc = glifuncs[name];
    WebGLRenderingContext.prototype[name] = _gliBind(name, WebGLRenderingContext.prototype[name], newFunc);
  }

  WebGLRenderingContext.prototype.__reset = function () {
    this.__gli.commands = [];
    this.__gli.totalDrawArraysCalls = 0;
    this.__gli.totalDrawElementsCalls = 0;
  };

  WebGLRenderingContext.prototype.__inspect = function () {
    if (this.__gli) {
      return;
    }

    let modules = {
      commands: [],
      totalDrawArraysCalls: 0,
      totalDrawElementsCalls: 0,
    };

    // modules.bufferViewer = new glpBufferViewer(this);
    // modules.callStack = new glpCallStack(this);
    // modules.frameControl = new glpFrameControl(this, window);
    // modules.duplicateProgramDetection = new glpDuplicateProgramDetection(this);
    // modules.histogram = new glpHistogram(this);
    // modules.messages = new glpMessages(this);
    // modules.pixelInspector = new glpPixelInspector(this);
    // modules.depthInspector = new glpDepthInspector(this);
    // modules.programUsageCounter = new glpProgramUsageCounter(this);
    // modules.stateTracker = new glpStateTracker(this);
    // modules.textureViewer = new glpTextureViewer(this);
    // modules.shaderViewer = new glpShaderViewer(this);
    // modules.mipmapViewer = new glpMipmapViewer(this);

    this.__gli = modules;
    return modules;
  };
}

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

class GLStats {
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

return GLStats;

}());
//# sourceMappingURL=gl-stats.dev.js.map
