import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { OpenAI } from "@langchain/openai";
import wxflows from "@wxflows/sdk/langchain";
// Connect to wxflows
const toolClient = new wxflows({
  endpoint: process.env.WXFLOWS_ENDPOINT || "",
  apikey: process.env.WXFLOWS_APIKEY,
});

// Retrieve the tools
const tools = await toolClient.lcTools;
const toolNode = new ToolNode(tools);

const initialiseModel = () => {
  const model = new OpenAI({
    model: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 4096,
    timeout: undefined,
    maxRetries: 2,
    streaming: true,
    apiKey: process.env.OPENAI_API_KEY,
    callbacks: [
      {
        handleLLMStart: async () => {
          // console.log("🤖 Starting LLM call");
        },
        handleLLMEnd: async (output) => {
          console.log("🤖 End LLM call", output);
          const usage = output.llmOutput?.usage;
          if (usage) {
            // console.log("📊 Token Usage:", {
            //   input_tokens: usage.input_tokens,
            //   output_tokens: usage.output_tokens,
            //   total_tokens: usage.input_tokens + usage.output_tokens,
            //   cache_creation_input_tokens:
            //     usage.cache_creation_input_tokens || 0,
            //   cache_read_input_tokens: usage.cache_read_input_tokens || 0,
            // });
          }
        },
        // handleLLMNewToken: async (token: string) => {
        //   // console.log("🔤 New token:", token);
        // },
      },
    ],
  });

  // Create an agent or chain with the tools
  const prompt =
    ChatPromptTemplate.fromTemplate(`Answer the following question using the available tools if necessary:
      Question: {input}
      Available tools: {tools}
      Answer: `);

  // Create a sequence that combines the prompt, tools, and model
  const chain = RunnableSequence.from([
    {
      input: (input) => input,
      tools: () =>
        tools.map((tool) => `${tool.name}: ${tool.description}`).join("\n"),
    },
    prompt,
    model,
    toolNode,
  ]);

  return model;
};
