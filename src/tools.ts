import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

export const writeFileTool = tool(
  async ({ filename, content }) => {
    const filepath = resolve(process.cwd(), filename);
    await writeFile(filepath, content, 'utf-8');
    return `File written successfully: ${filepath}`;
  },
  {
    name: 'write_file',
    description: 'Writes content to a file on disk. Use this to save text, code, or any content to a file.',
    schema: z.object({
      filename: z.string().describe('The name or relative path of the file to write'),
      content: z.string().describe('The content to write into the file'),
    }),
  }
);
