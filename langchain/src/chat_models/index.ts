
/* #__PURE__ */ console.error(
  "[WARN] Importing from 'langchain/chat_models' is deprecated. Import from eg. 'langchain/chat_models/openai' instead. See https://js.langchain.com/docs/getting-started/install#updating-from-0052 for upgrade instructions."
);

export { BaseChatModel, BaseChatModelParams, SimpleChatModel } from "./base.js";
export { ChatOpenAI } from "./openai.js";

import { AnthropicClient, AnthropicClientOptions } from "@anthropic-lang/sdk";
import { BaseChatModel, BaseChatModelParams } from "./base.js";

export class ChatAnthropic extends BaseChatModel {
  constructor(params: BaseChatModelParams & AnthropicClientOptions) {
    const { apiKey, modelId, ...anthropicOptions } = params;
    const client = new AnthropicClient(apiKey, modelId, anthropicOptions);
    super(client);
  }
}

