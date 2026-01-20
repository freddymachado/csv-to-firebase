
import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Initialize Google Cloud Storage
        // Credentials are loaded from process.env.GOOGLE_APPLICATION_CREDENTIALS automatically if set
        const storage = new Storage();
        const bucketName = process.env.GCS_BUCKET_NAME || 'trx-resources';
        const bucket = storage.bucket(bucketName);

        const timestamp = Date.now();
        const cleanFileName = file.name.replace(/\s+/g, '_');
        const destination = `uploads/${timestamp}-${cleanFileName}`;
        const fileObj = bucket.file(destination);

        await fileObj.save(buffer, {
            contentType: file.type,
            resumable: false, // Simple upload for small files
        });

        // Make the file public (optional, depending on requirements, but useful for verification)
        // await fileObj.makePublic(); 
        // const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;

        // Signed URL for secure access (valid for 1 hour)
        const [signedUrl] = await fileObj.getSignedUrl({
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60,
        });

        return NextResponse.json({
            success: true,
            url: signedUrl,
            path: destination
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
