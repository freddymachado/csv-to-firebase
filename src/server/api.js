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

// Normalize Referencia values for consistent uniqueness checks and storage
function normalizeReferencia(val) {
  if (val === undefined || val === null) return val;
  return String(val).trim().toLowerCase();
}

// Basic Auth middleware: protects non-local requests when credentials are configured
function isLocalRequest(req) {
  // Express populates req.ip and may include IPv4-mapped IPv6 addresses like ::ffff:127.0.0.1
  const ip = (req.ip || '').toString();
  const host = (req.hostname || req.get('host') || '').toString();
  const forwarded = (req.get('x-forwarded-for') || '').toString();
  const localIps = ['127.0.0.1', '::1'];
  if (localIps.includes(ip)) return true;
  if (ip.startsWith('::ffff:127.')) return true; // ::ffff:127.0.0.1
  if (/localhost/i.test(host)) return true;
  if (/127\.0\.0\.1/.test(forwarded)) return true;
  return false;
}

function basicAuth(req, res, next) {
  const user = process.env.API_BASIC_AUTH_USER;
  const pass = process.env.API_BASIC_AUTH_PASS;

  // If no credentials configured, do not enforce auth
  if (!user || !pass) return next();

  // Allow requests from local machine without auth (helps local dev and container setups)
  if (isLocalRequest(req)) return next();

  const authHeader = (req.headers.authorization || '');
  if (!authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Protected API"');
    return res.status(401).json({ ok: false, error: 'Authentication required' });
  }

  const base64Creds = authHeader.split(' ')[1] || '';
  let creds = '';
  try {
    creds = Buffer.from(base64Creds, 'base64').toString('utf8');
  } catch (e) {
    res.set('WWW-Authenticate', 'Basic realm="Protected API"');
    return res.status(400).json({ ok: false, error: 'Malformed authorization header' });
  }
  const idx = creds.indexOf(':');
  const suppliedUser = idx >= 0 ? creds.slice(0, idx) : creds;
  const suppliedPass = idx >= 0 ? creds.slice(idx + 1) : '';

  // Simple equality check; ensure both username and password match
  if (suppliedUser === user && suppliedPass === pass) return next();

  res.set('WWW-Authenticate', 'Basic realm="Protected API"');
  return res.status(401).json({ ok: false, error: 'Invalid credentials' });
}

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
// Protect the transactions write endpoint with Basic Auth for non-local requests
app.post('/api/transactions', basicAuth, async (req, res) => {
  const payload = req.body;
  const docs = Array.isArray(payload) ? payload : [payload];
  const collectionName = process.env.FS_COLLECTION || 'tpago';

  console.log('POST /api/transactions received, docs count=', docs.length);

  const results = [];
  for (const doc of docs) {
    try {
      // If the incoming doc has a 'Referencia' field, normalize it and attempt an atomic create
      // using that normalized value as the doc id. Also store the normalized value in the document.
      const rawReferencia = doc && (doc.Referencia || (typeof doc.Referencia === 'string' ? doc.Referencia : undefined));
      const normalizedRef = normalizeReferencia(rawReferencia);
      console.log('rawReferencia:', JSON.stringify(rawReferencia), 'normalizedRef:', JSON.stringify(normalizedRef));
      if (normalizedRef && normalizedRef !== '') {
        // Try to ensure a normalized doc id is used. If a raw-id doc already exists (e.g. created
        // before normalization was applied), atomically migrate it to the normalized id to avoid dupes.
        const normalizedId = normalizedRef;
        const rawId = (typeof rawReferencia === 'string' ? rawReferencia : undefined);
        const normDocRef = firestore.collection(collectionName).doc(normalizedId);
        const rawDocRef = rawId ? firestore.collection(collectionName).doc(rawId) : null;
        try {
          console.log('Attempt transaction create/migrate for normalized Referencia:', normalizedId, 'rawId:', JSON.stringify(rawId));
          const action = await firestore.runTransaction(async (t) => {
            const normSnap = await t.get(normDocRef);
            if (normSnap.exists) return { action: 'exists' };
            if (rawDocRef) {
              const rawSnap = await t.get(rawDocRef);
              if (rawSnap.exists) {
                // migrate: copy raw doc into normalized id (merge with incoming doc), delete raw
                const rawData = rawSnap.data() || {};
                const merged = { ...rawData, ...doc, Referencia: normalizedId };
                t.set(normDocRef, merged, { merge: true });
                t.delete(rawDocRef);
                return { action: 'migrated' };
              }
            }
            // neither normalized nor raw exist: create normalized doc
            const newDoc = { ...doc, Referencia: normalizedId };
            t.set(normDocRef, newDoc, { merge: true });
            return { action: 'created' };
          });
          console.log('Transaction action for', normalizedId, action);
          if (action && (action.action === 'created' || action.action === 'migrated')) {
            results.push({ id: normDocRef.id, status: 'saved', referencia: normalizedId, note: action.action });
            continue;
          }
          if (action && action.action === 'exists') {
            results.push({ status: 'skipped-duplicate-referencia', referencia: normalizedId, note: 'Referencia already exists (doc id)' });
            continue;
          }
        } catch (err) {
          console.error('Error creating/migrating doc by referencia transaction', err);
          // fall through to fallback behavior below
        }
      }
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

// GET /api/transactions - list recent transactions
// Query params: ?limit=100
app.get('/api/transactions', basicAuth, async (req, res) => {
  const collectionName = process.env.FS_COLLECTION || 'tpago';
  const limit = Math.min(1000, parseInt(req.query.limit || '200', 10) || 200);
  try {
    // Only return transactions with a non-empty amount field.
    // Some documents store amount under 'Monto' and others use 'Monto Bs.'; query both and merge.
    const snaps = [];
    try {
      const snap1 = await firestore.collection(collectionName).where('Monto', '!=', '').limit(limit).get();
      snaps.push(...snap1.docs);
    } catch (e) {
      // ignore; maybe no docs or unsupported index
      console.error('Error querying Monto field:', e.message || e);
    }
    try {
      const snap2 = await firestore.collection(collectionName).where('Monto Bs.', '!=', '').limit(limit).get();
      snaps.push(...snap2.docs);
    } catch (e) {
      console.error('Error querying Monto Bs. field:', e.message || e);
    }

    // Deduplicate by id and limit to requested limit
    const map = new Map();
    for (const d of snaps) {
      if (!map.has(d.id)) map.set(d.id, d);
      if (map.size >= limit) break;
    }
    const rows = Array.from(map.values()).slice(0, limit).map(d => ({ id: d.id, ...d.data() }));
    return res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    console.error('Error listing transactions', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.get('/api/ping', (req, res) => res.json({ ok: true, now: new Date().toISOString() }));
// Print auth status for operator visibility
const authConfigured = !!(process.env.API_BASIC_AUTH_USER && process.env.API_BASIC_AUTH_PASS);
if (authConfigured) {
  console.log('Basic Auth configured: non-local requests will require credentials (set API_BASIC_AUTH_USER and API_BASIC_AUTH_PASS)');
} else {
  console.log('Basic Auth not configured: API is unprotected for non-local requests. Set API_BASIC_AUTH_USER and API_BASIC_AUTH_PASS to enable protection.');
}

/* Example curl usage:
 *  - When Basic Auth is enabled (remote requests):
 *    curl -u user:pass -X POST http://127.0.0.1:3000/api/transactions -H "Content-Type: application/json" -d '[{"Referencia":"123","Monto":"Bs. 10,00"}]'
 *  - Local development (no auth needed for localhost):
 *    curl -X POST http://127.0.0.1:3000/api/transactions -H "Content-Type: application/json" -d '[{"Referencia":"123","Monto":"Bs. 10,00"}]'
 */

app.listen(PORT, () => console.log(`API server listening on http://127.0.0.1:${PORT}`));
