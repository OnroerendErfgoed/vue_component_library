// jsts dropped its `main` field in 2.7.3+, so the package must be imported via its
// bundled dist entry (which keeps the monkey-patched Geometry shortcut methods such as
// `.buffer()`, `.intersects()`, `.intersection()` and `.difference()`).
// Re-export the `@types/jsts` declarations onto that sub-path so the typings keep applying.
declare module 'jsts/dist/jsts.min.js' {
  import jsts = require('jsts');
  export = jsts;
}
