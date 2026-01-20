
/**
 * @jest-environment node
 */
import { POST } from './route';
import { NextRequest, NextResponse } from 'next/server';

// Create mocks for Google Cloud Storage
const mockSave = jest.fn();
const mockGetSignedUrl = jest.fn();
const mockFile = jest.fn(() => ({
    save: mockSave,
    getSignedUrl: mockGetSignedUrl,
    makePublic: jest.fn(),
}));
const mockBucket = jest.fn(() => ({
    file: mockFile,
}));
const mockStorage = jest.fn(() => ({
    bucket: mockBucket,
}));

// Mock the module
jest.mock('@google-cloud/storage', () => {
    return {
        Storage: jest.fn().mockImplementation(() => ({
            bucket: jest.fn().mockImplementation(() => ({
                file: jest.fn().mockImplementation(() => ({
                    save: mockSave,
                    getSignedUrl: mockGetSignedUrl,
                    makePublic: jest.fn(),
                })),
            })),
        })),
    };
});

describe('POST /api/upload', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if no file is uploaded', async () => {
        const formData = new FormData();
        const req = new NextRequest('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('No file uploaded');
    });

    it('should upload file and return 200 with URL', async () => {
        // Setup success response for signed URL
        mockGetSignedUrl.mockResolvedValue(['https://storage.googleapis.com/test-url']);

        // Create a dummy file
        const blob = new Blob(['test content'], { type: 'text/plain' });
        const file = new File([blob], 'test.txt', { type: 'text/plain' });

        const formData = new FormData();
        formData.append('file', file);

        const req = new NextRequest('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        // Check that we got the signed URL we mocked
        expect(data.url).toBe('https://storage.googleapis.com/test-url');

        // Verify Storage interactions
        // We only verify the end result (save called) because checking the constructor chain 
        // is difficult with the current hoisting-safe mock setup.
        const saveCall = mockSave.mock.calls[0];
        expect(saveCall).toBeTruthy();
        // Verify content type was passed
        expect(saveCall[1]).toMatchObject({
            contentType: 'text/plain',
            resumable: false
        });
    });

    it('should return 500 if storage upload fails', async () => {
        // Mock save to throw error
        mockSave.mockRejectedValue(new Error('Storage upload failed'));

        const blob = new Blob(['test content'], { type: 'text/plain' });
        const file = new File([blob], 'test.txt', { type: 'text/plain' });

        const formData = new FormData();
        formData.append('file', file);

        const req = new NextRequest('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Internal Server Error');
    });
});
