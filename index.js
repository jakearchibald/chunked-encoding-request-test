const http = require('http');
const express = require('express');
const app = express();
const port = 3000;

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

app.post('/chunked-upload-test', (req, res) => {
  console.log(req.headers);

  req.on('data', (chunk) => {
    console.log('Received', chunk.toString());
  });

  req.on('end', () => {
    console.log('Request ended');
    res.status(200).send('Thanks!');
  });
});

const server = app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
  const request = http.request(
    `http://localhost:${port}/chunked-upload-test`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
    },
    (response) => {
      console.log('Got response', response.statusCode);
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        console.log('Got response chunk', chunk);
      });
      response.on('data', () => {
        console.log('Response complete');
        server.close();
      });
    },
  );

  await wait(1000);
  request.write('hello', 'utf-8');
  await wait(1000);
  request.write('world', 'utf-8');
  await wait(1000);
  request.end();
});
