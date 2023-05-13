import { test, expect } from "@jest/globals";
import { Replicate } from "../replicate.js";

// Test skipped because Replicate appears to be timing out often when called
test.skip("Test Replicate", async () => {
  const model = new Replicate({
    model:
      "daanelson/flan-t5:04e422a9b85baed86a4f24981d7f9953e20c5fd82f6103b74ebc431588e1cec8",
    input: {
      max_length: 10,
    },
  });

  const textEncoder = new TextEncoder();
  const input = textEncoder.encode("Hello, my name is ");

  const res = await model.call(input);

  expect(typeof res).toBe("string");
});
