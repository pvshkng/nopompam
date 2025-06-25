'use server'

import { generateId, type Message } from "ai";
import { getThreadsCollection, DB, ARTIFACT_COLLECTION, mongoDbClient } from "@/lib/mongo/config";
import { ObjectId } from "mongodb";
import { MongoClient, Db, Collection } from "mongodb";

type ArtifactDocument = {
    artifactId: string;
    threadId: string;
    user: string;
    kind: string;
    title: string;
    content: string;
    status?: "idle" | "active" | "archived";
    isVisible?: boolean;

}

export async function storeArtifact(artifact: ArtifactDocument,
) {
    console.log("storing artifact: ", artifact);
    const collection = mongoDbClient.db(DB).collection(ARTIFACT_COLLECTION);
    try {
        await collection.insertOne({
            artifactId: artifact.artifactId,
            threadId: artifact.threadId,
            user: artifact.user,
            kind: artifact.kind,
            title: artifact.title,
            content: artifact.content,
            status: "active",
            isVisible: true,
            timestamp: Date.now().toString(),
        });
        console.log("Artifact was created with ID: ", artifact.artifactId);
    } catch (error) {
        console.error("Error while storing artifact: ", error);
    }


    // return _id;
}

export async function getArtifacts(threadId: string, user: string): Promise<ArtifactDocument[]> {
    const collection = mongoDbClient.db(DB).collection(ARTIFACT_COLLECTION);
    const filter = { threadId, user };
    const artifacts = await collection.find<ArtifactDocument>(filter).toArray();
    
    return artifacts.map(({ _id, ...artifact }) => artifact);
}
