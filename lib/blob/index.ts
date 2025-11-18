'use server';

import { FileAttachment } from '@/lib/stores/input-store';
import { put } from '@vercel/blob';

const path = '/agochat/';

export async function uploadFileToBlob(file: File): Promise<FileAttachment> {
    try {
        const blob = await put(path + file.name, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN!,
            addRandomSuffix: true,
            
        });

        return {
            type: 'file',
            filename: file.name,
            mediaType: file.type,
            url: blob.url,
            size: file.size,
        };
    } catch (error) {
        console.error('File upload failed:', error);
        throw new Error('Failed to upload file');
    }
}

export async function uploadMultipleFiles(files: FileList): Promise<FileAttachment[]> {
    const uploadPromises = Array.from(files).map(file => uploadFileToBlob(file));
    return Promise.all(uploadPromises);
}