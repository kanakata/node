/**
 * app name : dictionary app
 * description : a simple minimalistic dictionary application written in html, css, and javascript (frontend) and node js and express j (backend)
 * author : patrick kiprop
 * email : patrick37668@gmail.com
 */
const express = require('express');
const fs = require('fs');
const app = express();

let dictionary = {};

try {
  dictionary = JSON.parse(
    fs.readFileSync('./data.json', { encoding: 'utf-8' })
  );
} catch (error) {
  console.error('Error reading data.json:', error);
}

app.get('/', (request, response) => {
  fs.readFile('./index.html', { encoding: 'utf-8' }, (error, data) => {
    if (error) {
      response.status(500).send('Error reading index.html');
      return;
    }
    const headers = new Headers({
      'Content-Type': 'text/html',
      'X-Powered-By': 'dict-app',
      'Cache-Control': 'cache-control: cache, no-store, must-revalidate',
      Pragma: 'cache',
      Expires: '0',
    });
    response.setHeaders(headers).send(`${data}`);
  });
});

app.get('/dict', (request, response) => {
  const word =
    typeof request.query.word === 'string'
      ? request.query.word.trim().toLowerCase()
      : '';

  if (!word) {
    response.send(JSON.stringify([`No word entered!!!.`]));
    return;
  }
  const meaning = dictionary[word];
  if (!meaning) {
    response.send(JSON.stringify([`Oops!! meaning of ${word} not found.`]));
  } else {
    response.send(JSON.stringify(meaning));
  }
});

app.listen(8000, (error) => {
  if (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  } else {
    console.log('Server is running on http://localhost:8000');
  }
});
