
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
    t_dtype: any;
    onRuntimeInitialized?: Function;
    make_table: Function;
    make_gnode: Function;
    fill: Function;
  }

  //t_dtype

  function load_perspective(module: Module): PerspectiveModule;
};