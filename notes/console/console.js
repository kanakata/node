// Prompting user input via CLI
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// prompt
rl.question('What is your name? ', (data) => {
  console.log(`Hello ${data}`);
  rl.close();
});

// process.argv command line arguments
// process.argv is an array containing the command line arguments. The first element will be node, the second element will be the name of the JavaScript file. The next elements will be any additional command line arguments.

// Loading environment properties from a "property file"
// Install properties reader: npm install properties-reader --save
