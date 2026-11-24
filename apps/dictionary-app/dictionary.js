/**
 * app name : dictionary app
 * description : a simple minimalistic dictionary application written in html, css, and javascript (frontend) and node js and express j (backend)
 * author : patrick kiprop
 * email : patrick37668@gmail.com
 */
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

// views
app.set('view engine', 'ejs');
app.set('views', './views');
// middleware
app.use(express.static('public')).use(cors());

let dictionary = {};
try {
  dictionary = JSON.parse(
    fs.readFileSync('./data/data.json', { encoding: 'utf-8' })
  );
} catch (error) {
  console.error('Error reading data.json:', error);
}

app.get('/', (request, response) => {
  const headers = new Headers({
    'Content-Type': 'text/html',
    'X-Powered-By': 'dict-app',
  });
  response.setHeaders(headers).render('index');
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
