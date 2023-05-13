import { test, expect } from "@jest/globals";

import { OpenAIEmbeddings } from "../../embeddings/openai.js";
import { Document } from "../../document.js";
import { MemoryVectorStore } from "../memory.js";

test("MemoryVectorStore with external ids", async () => {
  const embeddings = new OpenAIEmbeddings();

  const store = new MemoryVectorStore(embeddings);

  expect(store).toBeDefined();

  await store.addDocuments([
    { pageContent: "hello", metadata: { a: 1 } },
    { pageContent: "hi", metadata: { a: 1 } },
    { pageContent: "bye", metadata: { a: 1 } },
    { pageContent: "what's this", metadata: { a: 1 } },
  ]);

  const encoder = new TextEncoder(); // Add TextEncoder to encode strings

  const results = await store.similaritySearch(encoder.encode("hello"), 1); // encode query string

  expect(results).toHaveLength(1);

  expect(results).toEqual([
    new Document({ metadata: { a: 1 }, pageContent: "hello" }),
  ]);
});
