'use server'

import { ARTIFACT_COLLECTION, connectToDatabase } from "@/lib/mongo/client";


type ArtifactDocument = {
    artifactId: string;
    threadId: string;
    user: string;
    kind: string;
    title: string;
    content: string;
    object?: Record<string, any>;
    status?: "idle" | "active" | "archived";
    isVisible?: boolean;

}

export async function storeArtifact(artifact: ArtifactDocument,
) {
    const { client, db } = await connectToDatabase();
    const collection = db.collection(ARTIFACT_COLLECTION);
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
    const { client, db } = await connectToDatabase();
    const collection = db.collection(ARTIFACT_COLLECTION);
    const filter = { threadId, user };
    const artifacts = await collection.find<ArtifactDocument>(filter).toArray();
    // @ts-ignore
    return artifacts.map(({ _id, ...artifact }) => artifact);
}


export async function getArtifact(artifactId: string/* , user: string */): Promise<ArtifactDocument> {
    const { client, db } = await connectToDatabase();
    const collection = db.collection(ARTIFACT_COLLECTION);
    const filter = { artifactId, /* user */ };
    const result = await collection.findOne(filter);
    // @ts-ignore
    return {
        artifactId: result?.artifactId,
        kind: result?.kind,
        title: result?.title,
        content: result?.content,
    }
}

export async function saveArtifact(artifactId: string, kind: string, title: string, content: string) {
    const { client, db } = await connectToDatabase();
    const collection = db.collection(ARTIFACT_COLLECTION);
    const filter = { artifactId };
    try {
        const result = await collection.updateOne(filter, { $set: { kind, title, content } });
        return result
    } catch (error) {
        console.error("Error while saving artifact: ", error);
    }
    // @ts-ignore

}