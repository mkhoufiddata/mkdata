import { gateway } from "@ai-sdk/gateway";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel
} from "ai";
import { isTestEnvironment } from "../constants";

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": gateway.languageModel("xai/grok-2-vision-1212"),
        "chat-model-reasoning": wrapLanguageModel({
          model: gateway.languageModel("xai/grok-3-mini"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": gateway.languageModel("xai/grok-2-1212"),
        "artifact-model": gateway.languageModel("xai/grok-2-1212"),
      },
    });

export const openSourceProvider = customProvider({
  languageModels: {
    "gpt-3.5-turbo": {
      provider: "openrouter",
      modelId: "gpt-3.5-turbo",
      baseUrl: "https://openrouter.ai/api/v1",
      apiKey: "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",
    },
  },
});
