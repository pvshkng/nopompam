import { z } from "zod";
import { tool } from "ai";

const ALPHA_VANTAGE_API_KEY = "LCXPFAQK4MVL8L4A"


export const stock = ({ }) => tool({
    description: "Retrieve stock price of a company",
    parameters: z.object({
        symbol: z.string().describe('a valid stock symbol'),
    }),
    execute: async ({ symbol }) => {
        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`)
            const data = await response.json();
            console.log("Stock response: ", data);
            return data
        } catch (error) {
            console.error("Stock error: ", error);
            return `Error while retrieving stock: ${symbol}`;
        }

    }
})