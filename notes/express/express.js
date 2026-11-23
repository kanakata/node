// simple app
const express = require('express');
const app = express();

app.get('/', (request, response) => {
  // define headers.
  const headers = new Headers({
    'Content-Type': 'text/html',
    'X-Powered-By': 'N/A',
  });
  response.setHeaders(headers).send(JSON.stringify([1, 2, 3, 4]));
});

app.listen(8000, (error) => {
  if (error) return console.log(error);
  console.log('App running!! on : http://localhost:8000');
});
// end of simple app
  
// basic methods/http verbs
// get data
app.get('/path', function (request, response, next) {});
// create data
app.post('/path', (request, response, next) => {});
// update data
app.put('/path', (request, response, next) => {});
// delete data
app.delete('/path', (request, response, next) => {});
// If you want to define the same behavior for a route and all HTTP methods, you can use:
app.all('/path', (request, response, next) => {});
app.use('/path', (request, response, next) => {});
app.use('*', (request, response, next) => {});

// chaining to a single path
app
  .route('/path')
  .get((request, response, next) => {})
  .post((request, response, next) => {});

// You can also add functions to any HTTP method. They will run before the final callback and take the parameters (req, res, next) as arguments.
app.get(
  '/path',
  (request, response, next) => {},
  (request, response, next) => {}
);

// router factories
// router.js
const express = require('express');
module.exports = function (options = {}) {
  // Router factory
  const router = express.Router();
  router.get('/greet', (req, res, next) => {
    res.end(options.greeting);
  });
  return router;
};

// application
const express = require('express');
const router = require('./router.js');
express()
  .use('/api/v1/', router({ greeting: 'Hello world' }))
  .listen(8080);

// templating (using jade)
app.set('view engine', 'jade'); //Sets jade as the View Engine / Template Engine
app.set('views', './views'); //Sets the directory where all the views (.jade files) are stored.
app.get('/', function (request, response) {
  response.render('index', { data: 'data' }, (err, html) => {}); //renders the index.jade file into html and returns as a response. The render function optionally takes the data to pass to the view.
});

// templating (using ejs)
app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/path', (request, response) => {
  response.render('index', {
    supplies: ['flour', 'milk', 'bread'],
    title: 'supplies',
  });
});

/* simple ejs file 
<h1><%= title %></h1>
  <ul>
  <% for(var i=0; i<supplies.length; i++) { %>
    <li>
        <a href='supplies/<%= supplies[i] %>'>
            <%= supplies[i] %>
        </a>
    </li>
  <% } %></ul>
*/

// json api's
const cors = require('cors');
app.use(cors()); // Use cors module for enable Cross-origin resource sharing
app.get('/path', (request, response) => {
  const info = {
    name: 'jane doe',
    age: 19,
  };
  response.json(info);
  // or
  /* response.send(JSON.stringify(info)) */
  //you can add a status code to the json response
  /* res.status(200).json(info) */
});

// serving static files
/** project root
    ├── server.js
    ├── package.json
    └── public
        ├── index.html
        └── script.js
 */
// configuring Express to serve static files:
app.use(express.static('public'));

// Adding Middleware
// make sure you add all the middleware before any routing actions.
app.use(cors());

// Error handling
/**
 * By default, Express will look for an 'error' view in the /views directory to render. Simply create the 'error' view and place it in the views directory to handle errors. Errors are written with the error message, status and stack trace, for example: 
 * views/error.pug
   html
   body
      h1= message
      h2= error.status
      p= error.stack
 */
// Define your error-handling middleware functions at the very end of the middleware function stack. These have four arguments instead of three (err,req,res,next)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  //pass error to the next matching route.
  next(err);
});

// handle error, print stacktrace
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err,
  });
});

// Getting info from the request
app.get('/path/:id/page=jane', (response, request) => {
  // get parameter
  const id = request.params.id;
  // get query value
  const page = request.query.page;
  // get url
  const url = request.originalUrl;
  // get header
  const contentType = request.get('Content-Type');
});

// Getting info using middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
/**
 * sample payload
 * 
  {
    "name": "Peter"
  }
 */
app.post('/upload', (request, response) => {
  // get name
  const name = request.body.name;
  // get cookie
  const cookie = request.cookies.name;
});

//  Error handling in Express
// In Express, you can define unified error handler for handling errors occurred in application. Define then handler at the end of all routes and logic code.
app.get('/names/:name', function (req, res, next) {
  if (req.params.name == 'john') {
    return res.send('Valid Name');
  } else {
    next(new Error('Not valid name')); //pass to error handler
  }
});

//error handler middleware
app.use(function (err, req, res, next) {
  console.log(err); // e.g., Not valid name
  return res.status(500).send('Internal Server Occurred');
});
app.listen(8000);

// Hook: How to execute code before any req and after any res
app.use(function (req, res, next) {
  function afterResponse() {
    res.removeListener('finish', afterResponse);
    res.removeListener('close', afterResponse);
    console.log('response done');
  }
  res.on('finish', afterResponse);
  res.on('close', afterResponse);
  // action before request
  // eventually calling `next()`
  next();
});

app.get('/names/:name', function (req, res, next) {
  if (req.params.name == 'john') {
    return res.send('Valid Name');
  } else {
    next(new Error('Not valid name')); //pass to error handler
  }
});

//error handler middleware
app.use(function (err, req, res, next) {
  console.log(err); // e.g., Not valid name
  return res.status(500).send('Internal Server Occurred');
});
app.listen(8000);

// Setting cookies with cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.get('/path', (request, response) => {
  // sending a cookie
  response.cookie('username', 'john doe', { maxAge: 900000, httpOnly: true });
  response.send();
});

// Custom middleware in Express
// each request will pass through it
app.use(function (req, res, next) {
  req.user = 'testuser';
  next(); // it will pass the control to next matching route
});
app.get('/path', function (req, res) {
  var user = req.user;
  console.log(user); // testuser
  return res.send(user);
});