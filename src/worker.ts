
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
        _update_callback: () => this._poolUpdate()
      });

      // Start updating pool
      setTimeout(() => this._processPool(), this._timeout * 4);

      let names = ["name", "price", "sales"];
      let types = [Module.t_dtype.DTYPE_STR, Module.t_dtype.DTYPE_FLOAT64, Module.t_dtype.DTYPE_FLOAT64];
      let index = ""; "name";
      let limit = 100;
      let tbl = Module.make_table(0, names, types, [], 0, limit, index, false, false);

      let gnode = Module.make_gnode(tbl);
      let gid = this._pool.register_gnode(gnode);

      let insert = () => {
        let data = [["Tom", "James", "Helen"], [1,2,3], [4,5,6]];
        let tbl = Module.make_table(data[0].length, names, types, data, 0, limit, index, false, false);

        this._pool.send(gid, 0, tbl);
        //Module.fill(this._pool, gnode, tbl);
        setTimeout(insert, this._timeout);
      }

      setTimeout(insert, this._timeout);
    }
  }

  process(ev: MessageEvent) {
    console.log("Main sent", ev.data);
  }

  post(msg: any) {
    this._ctx.postMessage(msg);
  }

  private _processPool() {
    this._pool.process();
    //console.log(this._pool.epoch());
    setTimeout(() => this._processPool(), this._timeout * 4);
  }

  private _poolUpdate() {
    console.log("Pool updated");
  }



  private _ctx: Worker;

  private _pool: any;
  private _timeout: number = 500;
}




const ctx: Worker = self as any;

if (typeof self !== "undefined" && self.addEventListener) {
   new WorkerHost(ctx);
}
