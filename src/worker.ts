
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
    Module.onRuntimeInitialized = () => {
      this._pool = new Module.t_pool({
        _update_callback: this.poolUpdate
      });

      // Start updating pool
      setTimeout(() => this.processPool(), this._timeout);
    }
  }

  process(ev: MessageEvent) {
    console.log("Main sent", ev.data);
  }

  processPool() {
    this._pool.process();
    setTimeout(() => this.processPool(), this._timeout);
  }

  poolUpdate() {
    console.log("Pool updated");
  }

  post(msg: any) {
    this._ctx.postMessage(msg);
  }

  private _ctx: Worker;

  private _pool: any;
  private _timeout: number = 500;
}

//pool = new __MODULE__.t_pool({_update_callback: function() {}});

const ctx: Worker = self as any;

if (typeof self !== "undefined" && self.addEventListener) {
   new WorkerHost(ctx);
}
