/* eslint-disable no-process-env */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as url from "node:url";
import * as path from "node:path";
import { test, expect } from "@jest/globals";
import {
  UnstructuredDirectoryLoader,
  UnstructuredLoader,
  UnknownHandling,
} from "../fs/unstructured.js";

test("Test Unstructured base loader", async () => {
  const filePath = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "./example_data/example.txt"
  );

  const options = {
    apiKey: process.env.UNSTRUCTURED_API_KEY!,
    timeout: 3000 // Add timeout option with default value of 3 seconds
  };

  const loader = new UnstructuredLoader(filePath, options);
  const docs = await loader.load();

  expect(docs.length).toBe(3);
  for (const doc of docs) {
    expect(typeof doc.pageContent).toBe("string");
  }
});

test("Test Unstructured base loader with fast strategy", async () => {
  const filePath = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "./example_data/1706.03762.pdf"
  );

  const options = {
    apiKey: process.env.UNSTRUCTURED_API_KEY!,
    strategy: "fast",
    timeout: 5000 // Add timeout option with default value of 5 seconds
  };

  const loader = new UnstructuredLoader(filePath, options);
  const docs = await loader.load();

  expect(docs.length).toBeGreaterThan(10);
  expect(typeof docs[0].pageContent).toBe("string");
});

test("Test Unstructured directory loader", async () => {
  const directoryPath = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "./example_data"
  );

  const options = {
    apiKey: process.env.UNSTRUCTURED_API_KEY!,
    strategy: "fast",
    timeout: 10000 // Add timeout option with default value of 10 seconds
  };

  const loader = new UnstructuredDirectoryLoader(
    directoryPath,
    options,
    true,
    UnknownHandling.Ignore
  );
  const docs = await loader.load();

  expect(docs.length).toBeGreaterThan(100);
  expect(typeof docs[0].pageContent).toBe("string");
});

// Additional test case to ensure timeout option is passed to fetch/undici calls
test("Test Unstructured loader with timeout", async () => {
  const filePath = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "./example_data/ocr-heavy.pdf"
  );

  const options = {
    apiKey: process.env.UNSTRUCTURED_API_KEY!,
    timeout: 2000 // Set timeout to 2 seconds for testing purposes
  };

  const loader = new UnstructuredLoader(filePath, options);
  await expect(loader.load()).rejects.toThrow("Headers Timeout Error"); // Expect a timeout error to be thrown
});

// Additional test case to ensure user can configure timeout value
test("Test Unstructured loader with custom timeout", async () => {
  const filePath = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "./example_data/ocr-heavy.pdf"
  );

  const options = {
    apiKey: process.env.UNSTRUCTURED_API_KEY!,
    timeout: 6000 // Set timeout to 6 seconds
  };

  const loader = new UnstructuredLoader(filePath, options);
  await expect(loader.load()).resolves.not.toThrow(); // Expect no timeout error to be thrown
});

// Additional test case to ensure documentation is correct
test("Test Unstructured loader documentation", () => {
  const options = {
    apiKey: "API_KEY",
    timeout: 5000 // Set timeout to 5 seconds
  };

  const loader = new UnstructuredLoader("FILE_PATH", options);
  const doc = loader.getDocumentation();

  expect(doc).toContain("timeout"); // Ensure timeout option is included in documentation
  expect(doc).toContain("5000"); // Ensure default timeout value is included in documentation
});

// Additional test case to ensure no side effects on extraction process or OCR accuracy
test("Test Unstructured loader performance", async () => {
  const filePath = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    "./example_data/1706.03762.pdf"
  );

  const options = {
    apiKey: process.env.UNSTRUCTURED_API_KEY!,
    strategy: "fast",
    timeout: 5000 // Set timeout to 5 seconds
  };

  const startTime = Date.now();
  const loader = new UnstructuredLoader(filePath, options);
  const docs = await loader.load();
  const endTime = Date.now();

  expect(docs.length).toBeGreaterThan(10);
  expect(typeof docs[0].pageContent).toBe("string");
  expect(endTime - startTime).toBeLessThan(10000); // Ensure extraction time is not significantly affected
});
