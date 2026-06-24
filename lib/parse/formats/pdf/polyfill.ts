const _global = typeof global !== "undefined" ? global : globalThis;

if (typeof _global.DOMMatrix === "undefined") {
  (_global as any).DOMMatrix = class DOMMatrix {
    constructor() {}
  };
}

if (typeof _global.Path2D === "undefined") {
  (_global as any).Path2D = class Path2D {
    constructor() {}
  };
}
