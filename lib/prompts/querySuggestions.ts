"use server";
import { langfuseClient } from "@/lib/langfuse";

export default async function querySuggestions() {
  try {
    const langfuse = langfuseClient;
    const suggestions = await langfuse.getPrompt("suggestions");
    const result = JSON.parse(suggestions.prompt);
    return result;
  } catch (error) {
    console.error(error);
    return [];
  } 
}
