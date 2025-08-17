import { UIMessageStreamWriter, tool, smoothStream, streamText, convertToModelMessages, convertToCoreMessages } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { storeArtifact } from "@/lib/mongo/artifact-store"
import type { UIMessage, ModelMessage } from 'ai';
import { removeProviderExecuted } from "@/lib/ai/utils";

const client = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  baseURL: process.env.GOOGLE_API_ENDPOINT,
});

interface DocumentProps {
  threadId: string;
  user: any;
  getMemory: () => ModelMessage[];
  writer: UIMessageStreamWriter;
}

const testData = [{ "role": "user", "content": [{ "type": "text", "text": "Research NVIDIA stock and write a document about it" }] }, { "role": "assistant", "content": [{ "type": "tool-call", "toolCallId": "1NwhExZqGlVdquk2", "toolName": "search", "input": { "queries": ["NVIDIA stock performance", "NVDA company profile"] } }] }, { "role": "tool", "content": [{ "type": "tool-result", "toolCallId": "1NwhExZqGlVdquk2", "toolName": "search", "output": { "type": "json", "value": { "0": [{ "title": "NASDAQ:NVDA Stock Price - Nvidia", "url": "https://www.tradingview.com/symbols/NASDAQ-NVDA/", "content": "The current price of NVDA is 180.07 USD — it has increased by 0.24% in the past 24 hours. Watch NVIDIA stock price performance more closely on the chart.", "rawContent": null, "score": 0.8282873, "favicon": "https://static.tradingview.com/static/images/favicon.ico" }, { "title": "NVIDIA Corporation (NVDA) stock historical prices and data", "url": "https://ca.finance.yahoo.com/quote/NVDA/history/", "content": "NVIDIA Corporation (NVDA) Stock Historical Prices & Data - Yahoo Finance *   Celebrity fashion *   Shop the look *   My Stocks *   Stocks: Most Actives *   Stocks: Gainers *   Stocks: Losers *   Advanced Chart *   US English *   Canada English *   My Stocks *   Stocks: Most Actives *   Stocks: Gainers *   Stocks: Losers *   Advanced Chart NVIDIA Corporation NVIDIA Corporation (NVDA) | Jun 11, 2025 | 0.01 Dividend | | Mar 12, 2025 | 0.01 Dividend | | Sep 12, 2024 | 0.01 Dividend | Canada markets closed    Canada  US  Europe  Asia  Cryptocurrencies  Rates  Commodities  Currencies    *   Portfolio Portfolio   Sign in to access your portfolio *   PUMP.CN Stock Trend Capital Inc.0.0100+0.0050(+100.00%)  *   VIK.CN Avila Energy Corporation 0.0050-0.0050(-50.00%)  *   TWOH-X.CN Two Hands Corporation 0.0050-0.0025(-33.33%) ", "rawContent": null, "score": 0.60386235, "favicon": "https://s.yimg.com/cv/apiv2/default/finance/favicon-180x180.png" }, { "title": "NVDA Stock Quote Price and Forecast", "url": "https://www.cnn.com/markets/stocks/NVDA", "content": "Price Momentum. NVDA is trading near the top ; Price change. The price of NVDA shares has increased $0.33 ; Closed at $181.59. The stock has since dropped $0.32", "rawContent": null, "score": 0.542161, "favicon": "https://cnn.com/media/sites/cnn/favicon.ico" }, { "title": "NVDA: NVIDIA Corp - Stock Price, Quote and News", "url": "https://www.cnbc.com/quotes/NVDA", "content": "NVIDIA Corp NVDA:NASDAQ ; Last | 10:46 AM EDT. 179.28 quote price arrow down -2.74 (-1.51%) ; Volume. 57,622,150 ; 52 week range. 86.62 - 184.48.", "rawContent": null, "score": 0.52568597, "favicon": "https://www.cnbc.com/favicon.ico" }, { "title": "NVIDIA (NVDA) Total Return YTD, TTM, 3Y, 5Y, 10Y, 20Y", "url": "https://www.financecharts.com/stocks/NVDA/performance/total-return", "content": "*   Top Screeners Stock ScreenersCustom ScreenerS&P 500 CompaniesBiggest CompaniesMost ProfitableBest PerformingWorst Performing52-Week Highs52-Week LowsBiggest Daily GainersBiggest Daily LosersMost Active TodayBest Growth Stocks All Stock Screeners  © 2025 FinanceCharts.com -  support@financecharts.com Disclaimers: FinanceCharts.com is not operated by a broker, a dealer, or a registered investment adviser. Under no circumstances does any information posted on FinanceCharts.com represent a recommendation to buy or sell a security. In no event shall FinanceCharts.com be liable to anyone using this site for any damages of any kind arising out of the use of any content or other material published or available on FinanceCharts.com, or relating to the use of, or inability to use, FinanceCharts.com or any content, including, without limitation, any investment losses, lost profits, lost opportunity, special, incidental, indirect, consequential or punitive damages.", "rawContent": null, "score": 0.4126491, "favicon": "https://www.financecharts.com/apple-touch-icon-180x180.png" }], "1": [{ "title": "Nvidia Corp Company Profile - GlobalData", "url": "https://www.globaldata.com/company-profile/nvidia-corp/", "content": "Nvidia Corp Company Profile - Nvidia Corp Overview - GlobalData NVIDIA Corp - Company Profile All the sales intelligence you need on NVIDIA Corp in one solution. The company offers its products to the gaming, professional visualization, data center, and automotive markets. The company serves diverse industries, including architecture, engineering, construction, cybersecurity, energy, financial services, healthcare and life sciences, education, gaming, manufacturing, media and entertainment, retail, robotics, telecommunications, and transportation. NVIDIA Corp premium industry data and analytics Improve competitive bidding with insights into all publicly disclosed IT services contracts for NVIDIA Corp (including IT outsourcing, business process outsourcing, systems integration & consulting and more). IT Client Prospector provides intelligence on NVIDIA Corp’s likely spend across technology areas enabling you to understand the digital strategy.", "rawContent": null, "score": 0.8687491, "favicon": "https://www.globaldata.com/favicon.png?v1" }, { "title": "NVIDIA Corp. Profile - NVDA", "url": "https://www.marketwatch.com/investing/stock/nvda/company-profile", "content": "NVIDIA Corp. engages in the design and manufacture of computer graphics processors, chipsets, and related multimedia software.", "rawContent": null, "score": 0.8405867, "favicon": "https://mw4.wsj.net/mw5/content/images/favicons/apple-touch-icon-152x152.png" }, { "title": "NVIDIA Corporation (NVDA) Company Profile & Facts", "url": "https://ca.finance.yahoo.com/quote/NVDA/profile/", "content": "NVIDIA Corporation, a computing infrastructure company, provides graphics and compute and networking solutions in the United States, Singapore, Taiwan, China,", "rawContent": null, "score": 0.81595254, "favicon": "https://s.yimg.com/cv/apiv2/default/finance/favicon-180x180.png" }, { "title": "NVDA: NVIDIA Corp - Stock Price, Quote and News", "url": "https://www.cnbc.com/quotes/NVDA", "content": "NVIDIA Corporation is a full-stack computing infrastructure company. The Company is engaged in accelerated computing to help solve the challenging", "rawContent": null, "score": 0.6609831, "favicon": "https://www.cnbc.com/favicon.ico" }, { "title": "NVIDIA | NVDA Stock Price, Company Overview & News", "url": "https://www.forbes.com/companies/nvidia/", "content": "# NVIDIA Upgrade to gain access to exclusive features and add your profile photo. ### NVIDIA Financial Summary ### Key Data Union Semiconductor Equipment ### Tony Iommi Charts His First Solo Top 40 Hit Thanks To An Unlikely Feature ### Billie Eilish’s Year-Old Album Returns To No. 1 On Multiple Charts ### Global Trade Unions Call For Investigation Into Migrant Worker Abuse In Saudi Arabia, Host Of 2034 World Cup ### Billy Joel’s Albums Surge Back To The Charts Following His Major Announcement ### When Is ‘From The World Of John Wick: Ballerina’ Coming To Streaming? ### Queen Claims Multiple Top 10 Hits With Decades-Old Classics ### 3 Key Takeaways From The CBO’s Report On The One Big Beautiful Bill", "rawContent": null, "score": 0.6307082, "favicon": "https://i.forbesimg.com/48X48-F.png" }] } } }] }, { "role": "user", "content": "Write a document about NVIDIA Stock Analysis" }]

export const document = ({ threadId, user, getMemory, writer }: DocumentProps) =>
  tool({
    description: `
    ## document
    # The "document" tool creates and updates text documents that render to the user on a space next to the conversation (referred to as the "dossier").
    # Use this tool when asked to work on writing that's long enough like article / essay.
    # Only invoke this tool once for each document you want to create.
    # DO NOT REPEAT THE CONTENT OF THIS TOOL SINCE IT'S ALREADY IN THE UI.
    `,
    inputSchema: z.object({
      title: z.string().describe("The title of the artifact. If the title is not provided, it will be inferred from the prompt."),
      kind: z.enum(["text"]),
    }),
    execute: async ({ title, kind }, { toolCallId }) => {
      const memory = getMemory();
      const cleanedMessages = memory.map(message => {
        if (message.role === 'tool') {
          return {
            role: 'tool',
            content: message.content.map(content => ({
              type: 'tool-result',
              toolCallId: content.toolCallId,
              toolName: content.toolName,
              output: {
                type: "text",
                value: JSON.stringify(content.output.value)
              }
            }))
          };
        }
        return message;
      });

      const prompt = [
        ...cleanedMessages,
        {
          role: "user",
          content: `
          <instructions>
          Write document about the given topic. 
          The content will be rendered in Tiptap editor, so format it accordingly.
          Do not include anything other than the content of the document.

          Use **HTML** to format the content. 
          For example:
          - USE tables for comparison or data presentation regardless of quality or quantity of data
          - USE headings to define sections
          - USE horizontal rules to split sections
          - USE bullet points for entries, etc.
          - INCLUDE relevant images if provided in the context, chat history or other sources.
          - DO NOT MAKE UP IMAGES, only use images that are provided.
          - ALWAYS include references to sources with href at the end if available.

          HTML MUST BE VALID and well-formed.

          Prohibitions:
          - DO NOT WRAP THE OUTPUT IN \`\`\`html \`\`\`
          - DO NOT INCLUDE <html> tag, just output the content
          - DO NOT LEAVE TRAILING EMPTY BULLET POINTS
          - DO NOT INCLUDE BACKTICKS OR MARKDOWN SYNTAX.
          </instructions>

          Now write a document about the following topic:
          ${title}
          ` }] as ModelMessage[];

      const id = toolCallId;
      try {
        // Send document initialization
        writer.write({
          type: 'data-document',
          data: {
            id: id,
            type: "init",
            content: {
              id,
              title,
              kind
            }
          }
        });

        // Send start streaming signal
        writer.write({
          type: 'data-document',
          data: {
            id: id,
            type: "start",
            content: ""
          }
        });

        let draftContent = '';
        const { fullStream } = streamText({
          model: client("gemini-2.5-flash"),
          messages: prompt,
          onFinish: async ({ response }) => {
            // Send stop streaming signal
            writer.write({
              type: 'data-document',
              data: {
                id: id,
                type: "stop",
                content: ""
              }
            });

            await storeArtifact({
              artifactId: id,
              threadId: threadId,
              user: user,
              kind: kind,
              title: title,
              content: draftContent,
            });
          },
          onError: (error) => {
            console.error("Error during artifact creation: ", error);
            // Send error signal
            writer.write({
              type: 'data-document',
              data: {
                id: id,
                type: "error",
                content: error
              }
            });
          },
        });

        for await (const delta of fullStream) {
          const { type } = delta;

          if (type === 'text-delta') {
            const { text } = delta;
            draftContent += text;

            writer.write({
              type: 'data-document',
              data: {
                id: id,
                type: 'text',
                content: text,
              }
            });
          }
        }

        return {
          id,
          title,
          kind,
          content: draftContent,
        };
      } catch (error) {
        console.error("Error during artifact creation: ", error);
        writer.write({
          type: 'data-document',
          data: {
            id: id,
            type: "error",
            content: error
          }
        });
        return error;
      }
    },
  });
