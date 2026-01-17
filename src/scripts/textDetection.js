import vision from '@google-cloud/vision';
import 'dotenv/config';

// Crea el cliente
const client = new vision.ImageAnnotatorClient();

async function extraerTexto(gcsUri) {
  // Petición de detección de texto
  const [result] = await client.documentTextDetection(gcsUri);
  const detections = result.textAnnotations;

  if (detections.length === 0) {
    console.log('No se detectó texto.');
    return;
  }

  // El primer elemento contiene todo el bloque de texto detectado
  console.log('Texto extraído:', detections[0].description);
  
  return detections[0].description;
}

// Ejemplo de uso con URI de Cloud Storage
extraerTexto('gs://trx-resources/tpago.jpeg').catch(console.error);