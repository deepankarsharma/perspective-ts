
import {
  load_perspective
} from "./psp.async";


const Module = load_perspective({
  wasmJSMethod: "native-wasm",
  printErr: (x: any) => console.error(x),
  print: (x:any) => console.log(x)
});


/**
 * A lightweight wrapper around the perspective web assembly.
 *
 */
class WorkerHost {
  /**
   * Construct a new worker.
   *
   */
  constructor(ctx: Worker) {
    this._ctx = ctx;

    this._ctx.addEventListener("message", this.process, false);
    Module.onRuntimeInitialized = () => this.post("perspective loaded in worker");
  }

  process(ev: MessageEvent) {
    console.log("Main sent", ev.data);
  }

  post(msg: any) {
    this._ctx.postMessage(msg);
  }

  private _ctx: Worker;
}

//pool = new __MODULE__.t_pool({_update_callback: function() {}});

const ctx: Worker = self as any;

if (typeof self !== "undefined" && self.addEventListener) {
   new WorkerHost(ctx);
}
