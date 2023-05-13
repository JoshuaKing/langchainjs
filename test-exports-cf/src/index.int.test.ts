import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("Worker", () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev("src/index.ts", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it("should return Hello World", async () => {
    const resp = await worker.fetch();
    expect(resp.ok).toBe(true);
    if (resp) {
      const text = await resp.text();
      expect(text.startsWith("Hello")).toBe(true);
    }
  }, 30000);

  it("should fix MemoryVectorStore similaritySearch timeout issue", async () => {
    const similaritySearch = async () => {
      try {
        const data = new TextEncoder().encode("example data");
        const embeddings = await worker.execute("getEmbeddings", data);
        return embeddings;
      } catch (e) {
        console.error(e);
        throw new Error("Unable to get embeddings");
      }
    };
    const resp = await similaritySearch();
    expect(resp).not.toBeNull();
  });
});
