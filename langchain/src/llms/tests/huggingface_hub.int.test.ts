import { test } from "@jest/globals";
import { HuggingFaceInference } from "../hf.js";

test("Test HuggingFace", async () => {
  const model = new HuggingFaceInference({ temperature: 0.1, topP: 0.5 });
  const input = "1 + 1 =";
  const encoder = new TextEncoder();
  const encodedInput = encoder.encode(input);
  const res = await model.call(encodedInput);
  console.log(res);
}, 50000);
