
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
    ++this.__gli.totalDrawArraysCalls;
    return original.apply(this, args);
  },

  drawElements (original, name, ...args) {
    ++this.__gli.totalDrawElementsCalls;
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

  WebGLRenderingContext.prototype.__inspect = function () {
    let modules = {
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

  WebGLRenderingContext.prototype.gli = function () {
    if ( this.__gli ) {
      return this.__gli;
    }
    return this.__inspect();
  };
}

bindWebGL();

class GLStats {
  costructor(dom, opts = {}) {
    // TODO
  }
}

return GLStats;

}());
//# sourceMappingURL=gl-stats.dev.js.map
