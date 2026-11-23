const http = require('http');

function createRedirectServer(port, targetPort = 3000) {
  const server = http.createServer((req, res) => {
    const targetUrl = `http://localhost:${targetPort}${req.url || '/'}`;
    res.writeHead(302, {
      'Location': targetUrl,
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${targetUrl}"><title>Redirecting to Exam Buddy</title></head><body><script>window.location.replace("${targetUrl}");</script>Redirecting to <a href="${targetUrl}">Exam Buddy on Port ${targetPort}</a>...</body></html>`);
  });

  server.on('error', (err) => {
    console.log(`Redirect server port ${port} notice: ${err.message}`);
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`Redirect helper listening on port ${port} -> forwarding to http://localhost:${targetPort}/`);
  });
  return server;
}

// Redirect port 3001 directly to standard port 3000
createRedirectServer(3001, 3000);
