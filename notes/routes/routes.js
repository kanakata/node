// creating a simple router
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
module.exports = routes;