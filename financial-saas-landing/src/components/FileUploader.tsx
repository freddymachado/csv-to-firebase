// Clasifica la transacción según el concepto
function classifyConcept(concept: string) {
    const lower = concept.toLowerCase();
    if (/supermercado|alimento|comida|mercado|restaurante|panaderia|bodega/.test(lower)) {
        return 'Alimentación';
    }
    if (/transporte|taxi|uber|bus|metro|gasolina|combustible/.test(lower)) {
        return 'Transporte';
    }
    if (/farmacia|medicina|salud|doctor|hospital/.test(lower)) {
        return 'Salud';
    }
    if (/servicio|agua|luz|electricidad|internet|teléfono/.test(lower)) {
        return 'Servicios';
    }
    if (/ropa|vestimenta|zapato|moda/.test(lower)) {
        return 'Vestimenta';
    }
    if (/educación|colegio|universidad|curso|libro/.test(lower)) {
        return 'Educación';
    }
    if (/entretenimiento|cine|teatro|música|juego/.test(lower)) {
        return 'Entretenimiento';
    }
    return 'Otro';
}
'use client';

import { useState, useRef } from 'react';
// Utilidad para parsear el texto extraído en transacciones
// Ajusta esta función según el formato real del texto extraído
function parseTransactions(text: string) {
    // Ejemplo: cada transacción separada por doble salto de línea
    // y cada campo separado por salto de línea o delimitador
    // Ajusta el regex según el formato real
    const transactions: Array<{ [key: string]: string }> = [];
    const blocks = text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
    for (const block of blocks) {
        // Ejemplo: cada campo en una línea, en orden
        // ['Referencia','Fecha de la operación','Monto','Destinatario','Concepto']
        const lines = block.split(/\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length >= 5) {
            transactions.push({
                Referencia: lines[0],
                'Fecha de la operación': lines[1],
                Monto: lines[2],
                Destinatario: lines[3],
                Concepto: lines.slice(4).join(' '), // Por si el concepto es multilinea
            });
        }
    }
    return transactions;
}

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string>('');
    const [publicUrl, setPublicUrl] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    // Add state for extraction
    const [extractedText, setExtractedText] = useState<string>('');
    const [isExtracting, setIsExtracting] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setMessage('');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setStatus('idle');
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus('uploading');
        setMessage('Uploading your file...');
        setExtractedText(''); // Reset previous text

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setStatus('success');
            setMessage('File uploaded successfully!');
            setPublicUrl(data.url);
            setFile(null); // Clear file after success

            // Auto-start extraction
            if (data.path) {
                handleExtraction(`gs://${process.env.NEXT_PUBLIC_GCS_BUCKET_NAME || 'trx-resources'}/${data.path}`);
            }

        } catch (error) {
            console.error('Upload error:', error);
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'An error occurred during upload.');
        }
    };

    const handleExtraction = async (gcsUri: string) => {
        setIsExtracting(true);
        setMessage('Extracting text from image...');

        try {
            const response = await fetch('/api/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gcsUri }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Extraction failed:', data.error);
                // Don't fail the whole process, just show upload success
                setMessage('File uploaded, but text extraction failed.');
            } else {
                setExtractedText(data.text);
                setMessage('File uploaded and text extracted successfully!');
            }
        } catch (error) {
            console.error('Extraction error:', error);
        } finally {
            setIsExtracting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${file ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.csv,.xlsx"
                />

                {file ? (
                    <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-400 mt-1">Images, PDF, CSV, Excel</p>
                    </div>
                )}
            </div>

            <div className="mt-6 flex flex-col gap-4">
                {status === 'idle' && (
                    <button
                        onClick={handleUpload}
                        disabled={!file}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${file
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                            }`}
                    >
                        Upload Transaction File
                    </button>
                )}

                {(status === 'uploading' || isExtracting) && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-blue-600 dark:text-blue-400">{message}</p>
                    </div>
                )}

                {status === 'success' && !isExtracting && (
                    <div className="flex flex-col gap-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="font-bold">Success!</span>
                            </div>
                            <p>{message}</p>
                            {publicUrl && (
                                <div className="mt-2 text-xs break-all">
                                    <span className="font-semibold">File URL:</span> {publicUrl}
                                </div>
                            )}
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-3 text-sm underline hover:text-green-800"
                            >
                                Upload another file
                            </button>
                        </div>

                        {extractedText && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Transacciones extraídas:</h3>
                                {parseTransactions(extractedText).length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-xs text-left border border-gray-200 dark:border-gray-700">
                                            <thead className="bg-gray-100 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-2 py-1 border">Referencia</th>
                                                    <th className="px-2 py-1 border">Fecha de la operación</th>
                                                    <th className="px-2 py-1 border">Monto</th>
                                                    <th className="px-2 py-1 border">Destinatario</th>
                                                    <th className="px-2 py-1 border">Concepto</th>
                                                    <th className="px-2 py-1 border">Clasificación</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {parseTransactions(extractedText).map((tx, idx) => (
                                                    <tr key={idx} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-950">
                                                        <td className="px-2 py-1 border">{tx.Referencia}</td>
                                                        <td className="px-2 py-1 border">{tx['Fecha de la operación']}</td>
                                                        <td className="px-2 py-1 border">{tx.Monto}</td>
                                                        <td className="px-2 py-1 border">{tx.Destinatario}</td>
                                                        <td className="px-2 py-1 border">{tx.Concepto}</td>
                                                        <td className="px-2 py-1 border">{classifyConcept(tx.Concepto)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <pre className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap overflow-auto max-h-60 bg-white dark:bg-gray-950 p-2 rounded border border-gray-100 dark:border-gray-800">
                                        {extractedText}
                                    </pre>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {status === 'error' && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-bold">Error</span>
                        </div>
                        <p>{message}</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-3 text-sm underline hover:text-red-800"
                        >
                            Try again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
