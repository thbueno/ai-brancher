import { OpenAI } from "@langchain/openai";

const initialiseModel = () => {
  const model = new OpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    maxTokens: undefined,
    timeout: undefined,
    maxRetries: 2,
    streaming: true,
    apiKey: process.env.OPENAI_API_KEY,
  });

  return model;
};
