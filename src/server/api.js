#!/usr/bin/env node
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Firestore } from '@google-cloud/firestore';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://127.0.0.1:8080' }));
app.use(bodyParser.json({ limit: '1mb' }));

// Initialize Firestore using CREDENTIALS env (JSON string) or Application Default Credentials
let firestore;
try {
  const CREDENTIALS = process.env.CREDENTIALS ? JSON.parse(process.env.CREDENTIALS) : null;
  if (CREDENTIALS) {
    firestore = new Firestore({
      projectId: CREDENTIALS.project_id,
      credentials: { client_email: CREDENTIALS.client_email, private_key: CREDENTIALS.private_key }
    });
  } else {
    firestore = new Firestore();
  }
} catch (err) {
  console.error('Failed to initialize Firestore:', err);
  process.exit(1);
}

// POST /api/transactions - accept a single object or an array of objects
app.post('/api/transactions', async (req, res) => {
  const payload = req.body;
  const docs = Array.isArray(payload) ? payload : [payload];
  const collectionName = process.env.FS_COLLECTION || 'tpago';

  const results = [];
  for (const doc of docs) {
    try {
      // Use Referencia or Número de confirmación as id if present to avoid duplicates
      let docRef;
      const idKey = doc['Número de confirmación'] || doc.Referencia || doc['Número de confirmación']?.toString();
      if (idKey) {
        docRef = firestore.collection(collectionName).doc(idKey.toString());
        await docRef.set(doc, { merge: true });
        results.push({ id: docRef.id, status: 'saved' });
      } else {
        docRef = await firestore.collection(collectionName).add(doc);
        results.push({ id: docRef.id, status: 'saved' });
      }
    } catch (err) {
      console.error('Error saving doc', err);
      results.push({ error: String(err) });
    }
  }

  res.json({ ok: true, saved: results.length, results });
});

app.get('/api/ping', (req, res) => res.json({ ok: true, now: new Date().toISOString() }));

app.listen(PORT, () => console.log(`API server listening on http://127.0.0.1:${PORT}`));
