import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex AI
// Ensure PROJECT_ID and LOCATION are set in environment variables
const project = process.env.GOOGLE_CLOUD_PROJECT || 'serviautosupremo-c8327';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

const vertex_ai = new VertexAI({ project: project, location: location });
const model = 'gemini-2.0-flash-001';

// Instantiate the generative model
const generativeModel = vertex_ai.getGenerativeModel({
    model: model,
    generationConfig: {
        responseMimeType: 'application/json',
    },
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { gcsUri } = body;

        if (!gcsUri) {
            return NextResponse.json({ error: 'Missing gcsUri parameter' }, { status: 400 });
        }

        const prompt = `
            Analyze the bank transaction image provided via GCS URI and extract the following information in JSON format:
            {
                "fecha": "The date of the transaction",
                "referencia": "The reference or operation number",
                "monto": "The transaction amount (as a number or string with currency)",
                "concepto": "The reason or concept for the transaction",
                "beneficiario": "The recipient or beneficiary of the transaction"
            }
            If a value is not found, return null for that field.
        `;

        const request = {
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt },
                        {
                            fileData: {
                                mimeType: 'image/jpeg', // Assuming jpeg/png common, Gemini handles most but good to specify
                                fileUri: gcsUri
                            }
                        }
                    ],
                },
            ],
        };

        const streamingResp = await generativeModel.generateContent(request);
        const response = await streamingResp.response;
        const text = response.candidates?.[0].content.parts[0].text;

        if (!text) {
            throw new Error('No content returned from Gemini');
        }

        const structuredData = JSON.parse(text);

        return NextResponse.json({ success: true, data: structuredData });

    } catch (error) {
        console.error('Error extracting transaction data:', error);
        return NextResponse.json({ error: 'Failed to extract transaction data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
