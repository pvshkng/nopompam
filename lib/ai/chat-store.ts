'use server'

import { generateId, type Message } from "ai";
import { redis } from "@/lib/crud/redis";

type Chat = {
    _id: string;
    user: string;
    messages: Message[];
};

const options = { ex: 60 * 60 * 24 };

function chatId(user?: string, id?: string) {
    const CHAT_FORMAT = "chat:{{user}}:{{id}}";
    if (!user || !id) {
        return CHAT_FORMAT.replace("{{user}}:{{id}}", "*")
    }
    return CHAT_FORMAT.replace("{{user}}", user).replace("{{id}}", id);
}


export async function createChat(user: string) {
    const _id = generateId();
    return _id;
}

export async function getChatsByUser(email: string) {

    try {
        const key = chatId(email, "*");
        //console.log("getChatsByUser key: ", key);
        const result: Chat[] | null = await redis.keys(key);
        //console.log("getChatsByUser result: ", result);
        if (result && result.length > 0) {
            const threads = await redis.mget(result);
            //console.log("getChatsByUser res: ", threads);
            return threads
        } else { return [] }

    } catch (error) {
        console.error("Error in getChatsByUser: ", error);
        return []
    }
}

export async function getChat(user: string, _id: string) {
    try {
        const key = chatId(user, _id);
        const result: Chat | null = await redis.get(key);
        if (result && result.messages) {
            const messages = result!.messages || [];
            return messages;
        } else { return [] }

    } catch (error) {
        console.error("Error in getChat: ", error);
        return []
    }
}

export async function saveChat({ _id, title, user, messages }) {
    //console.log("Saving chat: ", { _id, user, messages });
    const key = chatId(user, _id);
    await redis.set(key,
        JSON.stringify({
            _id: _id,
            user: user,
            title: title,
            timestamp: Date.now().toString(),
            messages: messages
        }),
        options);
}

export async function deleteChat(_id: string) { }