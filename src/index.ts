
class PerspectiveWorker {
  constructor() {
  };

  performIO() {
    let worker = new Worker("build/perspective-worker.js");

    worker.onmessage = (ev: MessageEvent) => {
      console.log("Worker sent", ev.data);
    }

    worker.postMessage("testing");
  }
}

const worker = new PerspectiveWorker();
export = worker;