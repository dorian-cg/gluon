import { ChatOllama } from '@langchain/ollama';
import { createAgent } from "langchain";
import { writeFileTool } from './tools';

const model = new ChatOllama({
  model: 'qwen2.5:14b',
  baseUrl: 'http://localhost:11434',
  temperature: 0,
  numCtx: 4096
});

export const agent = createAgent({
  model,
  tools: [
    writeFileTool
  ],
});
