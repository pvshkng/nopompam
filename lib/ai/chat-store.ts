import { generateId } from "ai";
import { redis } from "@/lib/crud/redis";

const options = { ex: 600 }

export async function createChat(user: string) {
    const _id = generateId();
    // await redis.set(
    //     `chat:${_id}`,
    //     JSON.stringify({ _id, user, messages: [] }),
    //     options
    //     // 7 days 60 * 60 * 24 * 7
    // );
    return _id;
}

export async function getChat(_id: string) {
    try {
        const result = await redis.get(`chat:${_id}`);
        if (result && result.messages) {
            const messages = result!.messages || [];
            return messages;
        } else { return [] }

    } catch (error) {
        console.error("Error in getChat: ", error);
        return []
    }
}

export async function saveChat({ _id, user, messages }) {
    console.log("Saving chat: ", { _id, user, messages });
    await redis.set(`chat:${_id}`,
        JSON.stringify({ _id, user, messages }),
        options);
}