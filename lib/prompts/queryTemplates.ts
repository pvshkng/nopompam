"use server";
import { langfuseClient } from "@/lib/langfuse";

export default async function queryTemplates() {
  try {
    const langfuse = langfuseClient;
    const templates = await langfuse.getPrompt("chat-templates");
    const result = JSON.parse(templates.prompt);
    return result;
  } catch (error) {
    console.error(error);
    return [];
  } 
}
