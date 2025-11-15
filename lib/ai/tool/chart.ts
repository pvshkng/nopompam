import { tool } from "ai";
import { z } from "zod";


export const chart = () =>
    tool({
        description: `
       Generate a chart based on the provided data and display it on UI.
    `,
        inputSchema: z.object({
            type: z.enum(["line", "bar", "pie", "area"])
                .describe(`
                    Type of chart to generate: line, bar, pie, or area.
                    - line: show trends over time
                    - bar: compare categories
                    - pie: show proportions of a whole
                    - area: show the magnitude of changes over time
                    If not specified, choose the chart type that best represents the data and insights.
                `),
            data: z.array(z.any().describe("Valid data point object with keys and values"))
                .describe(`
                    Array of data points for the chart. Each object can have any keys.
                    - The first string key will be used as the category/label axis (e.g., "month", "category", "name")
                    - All numeric keys will be plotted as series (e.g., "desktop", "mobile", "sales", "revenue")
                    
                    Example for bar/line/area:
                    [{ month: "Jan", desktop: 186, mobile: 80 }, { month: "Feb", desktop: 305, mobile: 200 }]
                    
                    Example for pie:
                    [{ browser: "chrome", visitors: 275 }, { browser: "safari", visitors: 200 }]
                `),
            title: z.string().optional().describe("Optional title for the chart"),
            description: z.string().optional().describe("Optional description for the chart"),
        }),
        execute: async ({ data, type, title, description }, { toolCallId }) => {
            return "Chart was successfully generated and displayed to the user."
        },
    });