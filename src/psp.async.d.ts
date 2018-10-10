
export = Perspective
export as namespace Perspective;

declare namespace Perspective {

  type WasmJSMethod = 'native-wasm';

  interface Module {
    wasmJSMethod?: WASMJSMethod,
    printErr?: Function,
    print?: Function,
  }

  interface PerspectiveModule {
    t_pool: any;
    onRuntimeInitialized?: Function;
  }

  function load_perspective(module: Module): PerspectiveModule;
};