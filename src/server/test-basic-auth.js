// Quick standalone tests for Basic Auth logic used in api.js
// Run with: node src/server/test-basic-auth.js

function isLocalRequest(req) {
  const ip = (req.ip || '').toString();
  const host = (req.hostname || req.getHost || '').toString();
  const forwarded = (req.headers && req.headers['x-forwarded-for']) || '';
  const localIps = ['127.0.0.1', '::1'];
  if (localIps.includes(ip)) return true;
  if (ip.startsWith('::ffff:127.')) return true;
  if (/localhost/i.test(host)) return true;
  if (/127\.0\.0\.1/.test(forwarded)) return true;
  return false;
}

function basicAuthForTest(req, res, next) {
  const user = process.env.API_BASIC_AUTH_USER;
  const pass = process.env.API_BASIC_AUTH_PASS;
  if (!user || !pass) return next();
  if (isLocalRequest(req)) return next();
  const authHeader = (req.headers && req.headers.authorization) || '';
  if (!authHeader.startsWith('Basic ')) return res.respond(401, 'Authentication required');
  const base64Creds = authHeader.split(' ')[1] || '';
  let creds = '';
  try { creds = Buffer.from(base64Creds, 'base64').toString('utf8'); } catch (_) { return res.respond(400, 'Malformed'); }
  const idx = creds.indexOf(':');
  const suppliedUser = idx >= 0 ? creds.slice(0, idx) : creds;
  const suppliedPass = idx >= 0 ? creds.slice(idx + 1) : '';
  if (suppliedUser === user && suppliedPass === pass) return next();
  return res.respond(401, 'Invalid');
}

function makeRes() {
  return {
    status: null,
    body: null,
    respond(code, body) { this.status = code; this.body = body; return this; }
  };
}

function runTests() {
  process.env.API_BASIC_AUTH_USER = 'testuser';
  process.env.API_BASIC_AUTH_PASS = 'testpass';

  // Local request should pass
  let called = false;
  basicAuthForTest({ ip: '127.0.0.1', headers: {} }, makeRes(), () => { called = true; });
  console.log('Local bypass test:', called ? 'PASS' : 'FAIL');

  // Remote request without auth should be 401
  let res = makeRes();
  basicAuthForTest({ ip: '8.8.8.8', headers: {} }, res, () => {});
  console.log('Remote without auth test:', res.status === 401 ? 'PASS' : `FAIL (status=${res.status})`);

  // Remote request with correct Basic auth should pass
  const token = Buffer.from('testuser:testpass').toString('base64');
  called = false; res = makeRes();
  basicAuthForTest({ ip: '8.8.8.8', headers: { authorization: 'Basic ' + token } }, res, () => { called = true; });
  console.log('Remote with valid auth test:', called ? 'PASS' : `FAIL (status=${res.status})`);
}

runTests();
