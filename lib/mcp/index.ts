import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp';

export const getMemoryBankMCPClient = async (email: string) => {

    const endpoint = process.env.MEMORY_BANK_MCP_URL!

    if (!endpoint) {
        throw new Error("Memory Bank MCP endpoint or API key is not defined in environment variables.");
    }

    let client

    try {
        client = await createMCPClient({
            transport: {
                type: 'http',
                url: endpoint,
                headers: {
                    "x-user-email": email,
                }
            }
        })
        return client
    } catch (error) {
        console.error("Failed to create MCP client: " + (error as Error).message);
        return null
    }
}
