import "dotenv/config";
import { type ModelMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createMockModel } from "./mock-model";
import { createInterface } from "node:readline";
import { calculatorTool, weatherTool } from "./tools/utility-tools";
import { agentLoop } from "./agent/loop";

const apiKey = process.env.API_KEY;

const gemini = createOpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
  name: process.env.NAME,
});

const model: any = apiKey ? gemini.chat(`{name}`) : createMockModel();

const tools = { get_weather: weatherTool, calculator: calculatorTool };
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
const messages: any[] = [];

const SYSTEM = `你是 Coding Agent，一个专注于软件开发的 AI 助手。
你说话简洁直接，喜欢用代码示例来解释问题。
如果用户的问题不够清晰，你会反问而不是瞎猜。`;

async function ask() {
  rl.question("\nYou: ", async (input) => {
    const trimmed = input.trim();
    if (!trimmed || trimmed === "exit") {
      console.log("Bye!");
      rl.close();
      return;
    }

    messages.push({ role: "user", content: trimmed });
    await agentLoop(model, tools, messages, SYSTEM);
    ask();
  });
}

console.log('Coding Agent v0.2 (type "exit" to quit)\n');
ask();
