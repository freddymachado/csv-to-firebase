
import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';

// Initialize the Vision client
// Authentication works automatically via GOOGLE_APPLICATION_CREDENTIALS environment variable
const client = new ImageAnnotatorClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { gcsUri } = body;

        if (!gcsUri) {
            return NextResponse.json({ error: 'Missing gcsUri parameter' }, { status: 400 });
        }

        // Perform text detection
        // documentTextDetection is optimized for dense text (like documents, receipts)
        const [result] = await client.documentTextDetection(gcsUri);
        const detections = result.textAnnotations;

        if (!detections || detections.length === 0) {
            return NextResponse.json({ text: '' });
        }

        // The first annotation contains the entire text
        const extractedText = detections[0].description;

        return NextResponse.json({ success: true, text: extractedText });

    } catch (error) {
        console.error('Error extracting text:', error);
        return NextResponse.json({ error: 'Failed to extract text' }, { status: 500 });
    }
}
