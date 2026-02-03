import { parentPort } from "worker_threads";
import { analyzeAI } from "../services/aiPrompt.service.js";

parentPort.on("message", async ({ resume, jd }) => {
  try {
    console.log("🧵 Worker received job");

    const result = await analyzeAI(resume, jd);

    parentPort.postMessage({
      ok: true,
      result
    });
  } catch (err) {
    parentPort.postMessage({
      ok: false,
      error: err.message || "Worker analysis failed"
    });
  }
});
