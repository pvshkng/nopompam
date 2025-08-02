import { z } from "zod";
import { tool } from "ai";

const randomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
    const randomChars = new Array(length);
    for (let i = 0; i < length; i++) {
        randomChars[i] = chars[Math.floor(Math.random() * chars.length)];
    }
    return randomChars.join('');
}

export const stock = ({ }) => tool({
    description: "Retrieve stock price of a company",
    parameters: z.object({
        symbol: z.string().describe('a valid stock symbol'),
    }),
    execute: async ({ symbol }) => {
        try {
            const ALPHA_VANTAGE_API_KEY = randomString(16);
            const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`)
            const data = await response.json();
            return data
        } catch (error) {
            console.error("Stock error: ", error);
            return `Error while retrieving stock: ${symbol}`;
        }

    }
})