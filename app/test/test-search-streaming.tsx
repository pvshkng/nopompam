"use client";

import { Search } from "@/components/tools/search";
import { useToolStore, SearchQuery } from "@/lib/stores/tool-store";
import { useState } from "react";

const mockTool = {
  //state: "input-streaming",
  //state: "input-available",
  state: "output-available",
  type: "tool-search",
  input: { queries: ["PPT stock news", "PTT holdings management direction"] },
  output: {
    "0": [
      {
        title: "What's new in Azure OpenAI in Azure AI Foundry Models?",
        url: "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/whats-new",
        content:
          "On August 6, 2024, OpenAI announced the latest version of their flagship GPT-4o model version 2024-08-06 . GPT-4o 2024-08-06 has all the capabilities of the",
        rawContent: null,
        score: 0.8245895,
        publishedDate: undefined,
        favicon: "https://learn.microsoft.com/favicon.ico",
      },
      {
        title: "OpenAI News",
        url: "https://openai.com/news/",
        content:
          "image generation API > cover image. Introducing our latest image generation model in the API. Product Apr 23, 2025 ; GPT-4.5. Introducing GPT-4.5. Release Feb 27",
        rawContent: null,
        score: 0.63452125,
        publishedDate: undefined,
        favicon: "https://openai.com/favicon.svg",
      },
      {
        title: "Changelog - OpenAI API",
        url: "https://platform.openai.com/docs/changelog",
        content:
          "Released o1-preview and o1-mini, new large language models trained with reinforcement learning to perform complex reasoning tasks. August, 2024. Aug 29. Feature.",
        rawContent: null,
        score: 0.6018984,
        publishedDate: undefined,
        favicon: "https://platform.openai.com/favicon-platform.png",
      },
      {
        title: "OpenAI Scrambles to Update GPT-5 After Users Revolt",
        url: "https://www.wired.com/story/openai-gpt-5-backlash-sam-altman/",
        content:
          "OpenAI's GPT-5 model was meant to be a world-changing upgrade to its wildly popular and precocious chatbot.",
        rawContent: null,
        score: 0.51603514,
        publishedDate: undefined,
        favicon:
          "https://www.wired.com/verso/static/wired-us/assets/favicon.ico",
      },
      {
        title: "GPT-5 and the new era of work",
        url: "https://openai.com/index/gpt-5-new-era-of-work/",
        content:
          "GPT-5 is OpenAI's most advanced model—transforming enterprise AI, automation, and workforce productivity in the new era of intelligent work.",
        rawContent: null,
        score: 0.44420364,
        publishedDate: undefined,
        favicon: "https://openai.com/favicon.svg",
      },
    ],
    "1": [
      {
        title: "Newsroom",
        url: "https://www.anthropic.com/news",
        content:
          "Anthropic is an AI safety and research company that's working to build reliable, interpretable, and steerable AI systems.",
        rawContent: null,
        score: 0.98512,
        publishedDate: undefined,
        favicon:
          "https://cdn.prod.website-files.com/67ce28cfec624e2b733f8a52/681d52619fec35886a7f1a70_favicon.png",
      },
      {
        title: "Release Notes",
        url: "https://docs.anthropic.com/en/release-notes/overview",
        content:
          "API Updates. Discover the latest enhancements, new features, and bug fixes for Anthropic's API. Claude Apps Updates. Learn about the newest features",
        rawContent: null,
        score: 0.98189,
        publishedDate: undefined,
        favicon:
          "https://mintlify.s3-us-west-1.amazonaws.com/anthropic/_generated/favicon/favicon-32x32.png?v=3",
      },
      {
        title: "Anthropic (@AnthropicAI) / X",
        url: "https://x.com/anthropicai?lang=en",
        content: `We're launching an "AI psychiatry" team as part of interpretability efforts at Anthropic! We'll be researching phenomena like model personas,`,
        rawContent: null,
        score: 0.98007,
        publishedDate: undefined,
        favicon: "https://abs.twimg.com/favicons/twitter.3.ico",
      },
      {
        title: "Home \\ Anthropic",
        url: "https://www.anthropic.com/",
        content:
          "Anthropic is an AI safety and research company that's working to build reliable, interpretable, and steerable AI systems.",
        rawContent: null,
        score: 0.97209,
        publishedDate: undefined,
        favicon:
          "https://cdn.prod.website-files.com/67ce28cfec624e2b733f8a52/681d52619fec35886a7f1a70_favicon.png",
      },
      {
        title: "Anthropic news and analysis",
        url: "https://techcrunch.com/tag/anthropic/",
        content:
          "Anthropic's Claude AI model can now handle longer prompts · Maxwell Zeff. 14 hours ago ; Anthropic takes aim at OpenAI, offers Claude to 'all three branches of",
        rawContent: null,
        score: 0.97039,
        publishedDate: undefined,
        favicon:
          "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png?w=32",
      },
    ],
    "2": [
      {
        title: "Gemini Apps' release updates & improvements",
        url: "https://gemini.google/release-notes/",
        content:
          "Explore the latest updates from Gemini Apps - including improvements in generative AI capabilities, expanded access, and more.",
        rawContent: null,
        score: 0.9858,
        publishedDate: undefined,
        favicon:
          "https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png",
      },
      {
        title: "Official Gemini news and updates | Google Blog",
        url: "https://blog.google/products/gemini/",
        content:
          "Aug 07 AI · The latest AI news we announced in July · Aug 06 Learning & Education · Back to school 2025 · Aug 06 Gemini App · Bringing the best of AI to",
        rawContent: null,
        score: 0.9833,
        publishedDate: undefined,
        favicon: "https://blog.google/favicon.ico",
      },
      {
        title:
          "Google brings first of its kind 'Gemini drops' for its AI updates",
        url: "https://www.androidcentral.com/apps-software/ai/google-brings-first-of-its-kind-gemini-drops-for-its-ai-updates",
        content:
          "With its July drop, Google is introducing tools that will increase users' productivity, allowing Gemini to handle monotonous tasks and save",
        rawContent: null,
        score: 0.97916,
        publishedDate: undefined,
        favicon:
          "https://cdn.mos.cms.futurecdn.net/flexiimages/ojylbffmdc1632303233.png",
      },
      {
        title: "Gemini - Google DeepMind",
        url: "https://deepmind.google/models/gemini/",
        content:
          "Gemini 2.5 is our most intelligent AI model, capable of reasoning through its thoughts before responding, resulting in enhanced performance and improved",
        rawContent: null,
        score: 0.97479,
        publishedDate: undefined,
        favicon:
          "https://deepmind.google/static/icons/google_deepmind_32dp.c67bb05568f4.ico",
      },
      {
        title: "Release notes | Gemini API | Google AI for Developers",
        url: "https://ai.google.dev/gemini-api/docs/changelog",
        content:
          "Model updates: Released Gemini 2.0 Flash Thinking Mode for public preview. Thinking Mode is a test-time compute model that lets you see the model's thought",
        rawContent: null,
        score: 0.97014,
        publishedDate: undefined,
        favicon:
          "https://www.gstatic.com/devrel-devsite/prod/v18c0c2eee8563a4b6cc1af57fb933ddf1b6767fab13f530923a6c204c8d00f83/googledevai/images/favicon-new.png",
      },
    ],
  },
};

export function TestSearchStreaming() {
  const [testTool, setTestTool] = useState({
    toolCallId: "test-tool-123",
    state: "input-available",
    type: "tool-search",
    input: { queries: ["PPT stock news", "PTT holdings management direction"] },
  });

  const { initializeDraftTool, updateQueryStatus, finalizeTool } =
    useToolStore();

  const simulateStreaming = () => {
    // Reset tool state
    setTestTool((prev) => ({ ...prev, state: "input-available" }));

    // Initialize draft tool
    initializeDraftTool("test-tool-123", "search", [
      "PPT stock news",
      "PTT holdings management direction",
    ]);

    // Simulate first query completion after 2 seconds
    setTimeout(() => {
      updateQueryStatus("test-tool-123", 0, "complete", [
        {
          title: "What's new in Azure OpenAI in Azure AI Foundry Models?",
          url: "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/whats-new",
          content:
            "On August 6, 2024, OpenAI announced the latest version of their flagship GPT-4o model version 2024-08-06 . GPT-4o 2024-08-06 has all the capabilities of the",
          favicon: "https://learn.microsoft.com/favicon.ico",
        },
      ]);
    }, 2000);

    // Simulate second query completion after 4 seconds
    setTimeout(() => {
      updateQueryStatus("test-tool-123", 1, "complete", [
        {
          title: "PTT Holdings Management Update",
          url: "https://example.com/ptt-news",
          content:
            "Recent management changes and strategic direction updates for PTT Holdings",
          favicon: "https://example.com/favicon.ico",
        },
      ]);
    }, 4000);

    // Finalize after 5 seconds
    setTimeout(() => {
      const finalResults = {
        "0": [
          {
            title: "What's new in Azure OpenAI in Azure AI Foundry Models?",
            url: "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/whats-new",
            content:
              "On August 6, 2024, OpenAI announced the latest version of their flagship GPT-4o model version 2024-08-06 . GPT-4o 2024-08-06 has all the capabilities of the",
            favicon: "https://learn.microsoft.com/favicon.ico",
          },
        ],
        "1": [
          {
            title: "PTT Holdings Management Update",
            url: "https://example.com/ptt-news",
            content:
              "Recent management changes and strategic direction updates for PTT Holdings",
            favicon: "https://example.com/favicon.ico",
          },
        ],
      };

      finalizeTool("test-tool-123", finalResults);
      setTestTool((prev) => ({
        ...prev,
        state: "output-available",
        output: finalResults,
      }));
    }, 5000);
  };

  return (
    <div className="p-4">
      <button
        onClick={simulateStreaming}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Simulate Streaming
      </button>

      <Search tool={testTool} />
    </div>
  );
}
