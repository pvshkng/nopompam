'use server'

import { generateId, type Message } from "ai";
import { DB, THREAD_COLLECTION, connectToDatabase } from "@/lib/mongo/client";
import { ObjectId } from "mongodb";

type Chat = {
    _id: string;
    user: string;
    title?: string;
    messages: Message[];
    timestamp?: string;
};

export async function createThread(user: string, title: string = "New Chat") {
    const _id = generateId();
    const { client, db } = await connectToDatabase();
    const collection = db.collection(THREAD_COLLECTION);
    await collection.insertOne({
        _id: new ObjectId(_id),
        title: title,
        user: user,
        messages: [],
        timestamp: Date.now().toString(),
    });
    return _id;
}

export async function getThreads(email: string) {
    try {
        const { client, db } = await connectToDatabase();
        const collection = db.collection(THREAD_COLLECTION);
        const docs = await collection.find({ user: email }).toArray();
        const threads: Chat[] = docs.map((doc: any) => ({
            _id: doc._id.toString(),
            title: doc.title,
            user: doc.user,
            messages: doc.messages,
            timestamp: doc.timestamp,
        }));
        return threads;
    } catch (_) {
        console.error("Error: ", _);
        return [];
    }
}

export async function getThread(user: string, _id: string) {
    try {
        const { client, db } = await connectToDatabase();
        const collection = db.collection(THREAD_COLLECTION);
        // @ts-ignore
        const doc = await collection.findOne({ _id: _id, user });
        const chat: Chat | null = doc
            ? {
                _id: doc._id.toString(),
                title: doc.title,
                user: doc.user,
                messages: doc.messages,
                timestamp: doc.timestamp,
            }
            : null;
        if (chat && chat.messages) {
            return chat.messages;
        } else {
            return [];
        }
    } catch (_) {
        console.error("Error: ", _);
        return [];
    }
}

export async function saveChat({ _id, title, user, messages }: { _id: string; title?: string; user: string; messages: Message[] }) {
    try {
        const { client, db } = await connectToDatabase();
        const collection = db.collection(THREAD_COLLECTION);
        const update: any = { messages };
        if (title) {
            update.title = title;
            update.timestamp = Date.now().toString();
        }
        await collection.updateOne(
            // @ts-ignore
            { _id: _id, user },
            { $set: update },
            { upsert: true }
        );
    } catch (_) {
        console.error("Error: ", _);
    }
}

export async function deleteThread(_id: string, user?: string) {
    try {
        const { client, db } = await connectToDatabase();
        const collection = db.collection(THREAD_COLLECTION);
        const filter = user ? { _id: _id, user } : { _id: _id };
        // @ts-ignore
        await collection.deleteOne(filter);
        return { success: true };
    } catch (_) {
        console.error("Error: ", _);
        return { success: false, error: _ };
    }
}