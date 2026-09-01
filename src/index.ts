import "dotenv/config";
import { type ModelMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createMockModel } from "./mock-model";
import { createInterface } from "node:readline";
import { agentLoop } from "./agent/loop";
import { allTools } from "./tools";
import { ToolRegistry } from "./tools/tool-registry";

const apiKey = process.env.API_KEY;

const gemini = createOpenAI({
  baseURL: process.env.BASE_URL,
  apiKey: process.env.API_KEY,
  name: process.env.NAME,
});

const model: any = apiKey ? gemini.chat(`{name}`) : createMockModel();

const registry = new ToolRegistry();
registry.register(...allTools);
console.log(`已注册 ${registry.getAll().length} 个工具：`);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
const messages: ModelMessage[] = [];

const SYSTEM = `
你是一个专家级编程助手。你通过读取文件、执行命令、编辑代码以及编写新文件来为用户提供帮助`;

async function ask() {
  rl.question("\nYou: ", async (input) => {
    const trimmed = input.trim();
    if (!trimmed || trimmed === "exit") {
      console.log("Bye!");
      rl.close();
      return;
    }

    messages.push({ role: "user", content: trimmed });
    await agentLoop(model, registry, messages, SYSTEM);
    ask();
  });
}

console.log('Coding Agent v0.3 (type "exit" to quit)\n');
ask();
