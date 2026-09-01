import type { ToolDefinition } from "./tool-registry";
import {
  readFileTool,
  writeFileTool,
  editFileTool,
  listDirectoryTool,
} from "../tools/CommonTool/file-tools";
import { globTool, grepTool } from "../tools/CommonTool/search-tools";
import { bashTool } from "../tools/CommonTool/shell-tools";
import { startPreviewTool } from "./CommonTool/start_preview-tools";

export const allTools: ToolDefinition[] = [
  globTool,
  grepTool,
  readFileTool,
  writeFileTool,
  editFileTool,
  listDirectoryTool,
  bashTool,
  startPreviewTool,
];

export {
  readFileTool,
  writeFileTool,
  editFileTool,
  listDirectoryTool,
  globTool,
  grepTool,
  bashTool,
  startPreviewTool,
};
