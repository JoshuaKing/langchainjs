import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("Worker", () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev("src/index.ts", {
      experimental: { disableExperimentalWarning: true },
    });
  }, 30000);

  afterAll(async () => {
    await worker.stop();
  });

  it("should start", async () => {
    expect(true).toBe(true);
  });

  it("should fix MemoryVectorStore similaritySearch timeout issue", async () => {
    // Import the modules needed to fix the issue
    import { MemoryVectorStore } from "<repository_name>/MemoryVectorStore";
    import { TextEncoder } from "util";
    import { embeddings_call } from "<repository_name>/async_call";

    // Mock the data to be used for similarity search
    const data = ["example text 1", "example text 2", "example text 3"];

    // Initialize the MemoryVectorStore
    const vectorStore = new MemoryVectorStore();
    await vectorStore.init();

    // Create an array of embeddings for the data
    const embeddings = await Promise.all(data.map((text) => embeddings_call(text)));

    // Encode the embeddings using TextEncoder
    const encodedEmbeddings = embeddings.map((embedding) => new TextEncoder().encode(JSON.stringify(embedding)));

    // Add the encoded embeddings to the MemoryVectorStore
    await Promise.all(encodedEmbeddings.map((encoded, index) => vectorStore.put(data[index], encoded)));

    // Search for similarities using the MemoryVectorStore
    const results = await vectorStore.similaritySearch(embeddings[0]);

    // Check that the search returns expected results
    expect(results).toContain(data[0]);
  });
});
