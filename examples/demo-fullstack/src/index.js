import http from 'node:http';

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'DevMirror Demo Fullstack Application is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: {
      databaseConfigured: !!process.env.DATABASE_URL,
      redisConfigured: !!process.env.REDIS_URL,
    }
  }));
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
