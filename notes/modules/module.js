/* 
  What is a node.js module : A module encapsulates related code into a single unit of code. When creating a module, this can be
  interpreted as moving all related functions into a file.
  Node provides the module.exports interface to expose functions and variables to other files.
*/

// The most simple way to do so is to export only one object (function or variable),
// exporting a module (one function)
module.exports = function (name) {
  console.log('Hello' + name);
};

// as an object
function Hello(name) {
  console.log('Hello' + name);
}
module.exports = {
  hello: hello,
};

// or
module.exports = {
  greet: function (name) {
    console.log('Hello' + name);
  },
  get_age: function () {
    var username = process.argv[2];
    if (!username) {
      console.log('No name has been provided');
      process.exit(1);
    }
    console.log(username);
  },
  app_name: 'My App Name',
};

// or
exports.hello = function (name) {
  console.log('Hello' + name);
};

// importing
const greet = require('./module.js');
greet(this.name);

// importing and consuming object export
const obj = require('./modules.js');
console.log(obj.app_name);
obj.greet();
obj.get_age();

// loading inbuilt modules
const http = require('http'); // no need to specify a path just the name of the module

// loading modules inside node_modules folder.
const express = require('express');

/* if a module is inside a folder you can add a package .json file to point to the entry point to your app
{
  "name": "module name i.e my-module",
  "main": "file name i.e ./file_name.js",
}
*/

// you can alternatively add the module inside the node_modules folder.

// NOTE: modules are injected only once
// Building your own modules
const auth = (module.exports = {});
auth.email = function (data, callback) {
  // Authenticate with an email address
};
auth.facebook = function (data, callback) {
  // Authenticate with a Facebook account
};
auth.twitter = function (data, callback) {
  // Authenticate with a Twitter account
};
auth.slack = function (data, callback) {
  // Authenticate with a Slack account
};
auth.stack_overflow = function (data, callback) {
  // Authenticate with a Stack Overflow account
};

// Invalidating the module cache
/**
 In development, you may find that using require() on the same module multiple times always returns the same module, even if you have made changes to that file. This is because modules are cached the first time they are loaded, and any subsequent module loads will load from the cache.
*/
// To get around this issue, you will have to delete the entry in the cache. For example, if you loaded a module
var a = require('./a');
// You could then delete the cache entry:
var r_path = require.resolve('./a.js');
delete require.cache[r_path];
// And then require the module again:
var a = require('./a');
/**
 Do note that this is not recommended in production because the delete will only delete the reference to the loaded module, not the loaded data itself. The module is not garbage collected, so improper use of this feature could lead to leaking memory.
*/

// Exporting and importing modules in node js
// Exporting with ES6
export function greet(user_name) {
  console.log(`Hello ${user_name}`);
}

// Module in node js : a module encapsulates related code into a single unit of code.
// Exporting
exports.greet = function (user_name) {
  console.log(`Hello ${user_name}`);
};
module.exports = {
  greet: function (user_name) {
    console.log(`Hello ${user_name}`);
  },
};

// How modules are loaded
// Node first looks up the node_modules folder inside the referenced folder in the required statement if the module is not found and is not a core node module then node will look it up inside the node_modules folder in the current directory.

// method 1
module.exports = function () {
  console.log('Hello World');
};

//
module.exports = {
  greet: function () {
    console.log('Hello World');
  },
};

exports.greet = function () {
  console.log('Hello World');
};