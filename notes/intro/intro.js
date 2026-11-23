// creating a simple server.
const http = require('http');

http
  .createServer((request, response) => {
    response.writeHead(200, {
      'content-type': 'text/plain',
    });
    response.write('Hello World');
    response.end();
  })
  .listen(8000);

// command line
// #!/usr/bin / env node
('use strict');
const username = process.argv[2];
console.log('Hello ' + username);

// Hello world with express
const express = require('express');
const app = express();

app.get('/', function (request, response) {
  response.send('Hello world');
});

app.listen(8000, function () {
  console.log('Server running on port: ', 8000);
});

// Basic routing
const http = require('http');
const routes = {
  '/': (request, response) => {
    response.writeHead(200);
    response.end('<h1>Hello from the index page.</h1>');
  },
  '/login': (request, response) => {
    response.writeHead(200);
    response.end('<h1>Hello from the login page.</h1>');
  },
  '/dash': (request, response) => {
    response.writeHead(200);
    response.end('<h1>Hello from the dashboard page.</h1>');
  },
};

http
  .createServer((request, response) => {
    if (request.url in routes) {
      return routes[request.url](request, response);
    }
    response.writeHead(404);
    response.end();
  })
  .listen(8000);

// or
// Basic routing
const routes = require('./modules/routes'); // collect the routes.
http
  .createServer((request, response) => {
    if (request.url in routes) {
      return routes[request.url](request, response);
    }
    response.writeHead(404);
    response.end();
  })
  .listen(8000);