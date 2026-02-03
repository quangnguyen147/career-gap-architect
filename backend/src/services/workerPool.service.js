import { Worker } from "worker_threads";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WorkerPool {
  constructor(size = Math.max(os.cpus().length - 1, 1)) {
    this.size = size;
    this.workers = [];
    this.idleWorkers = [];
    this.queue = [];
    this.isShuttingDown = false;

    this.init();
  }

  init() {
    for (let i = 0; i < this.size; i++) {
      this.createWorker();
    }
    console.log(`✅ WorkerPool initialized with ${this.size} workers`);
  }

  createWorker() {
    const worker = new Worker(
      path.join(__dirname, "../workers/analysis.worker.js"),
      { type: "module" },
    );

    worker.currentJob = null;

    worker.on("message", (msg) => this.handleMessage(worker, msg));
    worker.on("error", (err) => this.handleError(worker, err));
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.warn(`♻ Worker exited with code ${code}`);
      }
      this.replaceWorker(worker);
    });

    this.workers.push(worker);
    this.idleWorkers.push(worker);
  }

  exec(data, options = {}) {
    if (this.isShuttingDown) {
      return Promise.reject(new Error("WorkerPool is shutting down"));
    }

    const job = {
      data,
      retries: options.retries ?? 2,
      timeout: options.timeout ?? 20000,
      resolve: null,
      reject: null,
      timer: null,
      lastError: null,
    };

    return new Promise((resolve, reject) => {
      job.resolve = resolve;
      job.reject = reject;

      if (this.idleWorkers.length > 0) {
        const worker = this.idleWorkers.shift();
        this.run(worker, job);
      } else {
        this.queue.push(job);
      }
    });
  }

  run(worker, job) {
    worker.currentJob = job;

    job.timer = setTimeout(() => {
      const err = new Error(`Worker timeout after ${job.timeout}ms`);
      err.code = "WORKER_TIMEOUT";

      console.warn("⏱", err.message);

      job.lastError = err;

      worker.terminate();
      this.retry(job);
    }, job.timeout);

    worker.postMessage(job.data);
  }

  handleMessage(worker, msg) {
    const job = worker.currentJob;
    if (!job) return;

    clearTimeout(job.timer);
    worker.currentJob = null;
    this.idleWorkers.push(worker);

    if (msg?.ok) {
      job.resolve(msg.result);
    } else {
      job.lastError = new Error(msg?.error || "Worker execution failed");
      this.retry(job);
    }

    this.runNext();
  }

  handleError(worker, err) {
    const job = worker.currentJob;
    if (!job) return;

    clearTimeout(job.timer);

    console.error("💥 Worker crashed:", err.message);

    job.lastError = err;

    worker.terminate();
    this.retry(job);
  }

  retry(job) {
    if (job.retries > 0) {
      job.retries--;
      console.log(`🔁 Retry job (${job.retries} left)`);
      this.queue.unshift(job);
    } else {
      job.reject(job.lastError ?? new Error("Worker failed after retries"));
    }
  }

  runNext() {
    if (this.queue.length === 0) return;
    if (this.idleWorkers.length === 0) return;

    const job = this.queue.shift();
    const worker = this.idleWorkers.shift();

    this.run(worker, job);
  }

  replaceWorker(oldWorker) {
    this.workers = this.workers.filter((w) => w !== oldWorker);
    this.idleWorkers = this.idleWorkers.filter((w) => w !== oldWorker);

    if (!this.isShuttingDown) {
      this.createWorker();
    }
  }

  async shutdown() {
    console.log("🛑 Shutting down WorkerPool...");
    this.isShuttingDown = true;

    await Promise.all(
      this.workers.map((worker) => {
        return new Promise((resolve) => {
          if (!worker.currentJob) return resolve();
          worker.once("message", resolve);
          worker.once("error", resolve);
        });
      }),
    );

    for (const worker of this.workers) {
      await worker.terminate();
    }

    console.log("✅ WorkerPool shutdown complete");
  }
}

export const workerPool = new WorkerPool(4);
