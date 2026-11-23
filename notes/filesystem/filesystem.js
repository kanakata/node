// filesystem.
const { error } = require('console');

// we use the filesystem module for all file operations:
const fs = require('fs');

// read with encoding
fs.readFile('file path', { encoding: 'utf-8' }, (error, content) => {
  if (error) return console.error(error);
  console.log(content);
});

// read without encoding
fs.readFile('file path', (error, content) => {
  if (error) return console.error(error);
  console.log(content);
});

// Listing Directory Contents with readdir
fs.readdir('dir', (error, content) => {
  if (error) return console.error(error);
  console.log(content);
});

// Listing Directory Contents with readdirSync
let files;
try {
  files = fs.readdirSync('/var/tmp');
} catch (err) {
  console.error(err);
}

// using a generator
function run(gen) {
  var iter = gen((error, data) => {
    return iter.next(data);
  });
  iter.next();
}

run(function* (resume) {
  var content = yield fs.readdir('./', resume);
  console.log(content);
});

// copying with using streams
/* Create readable stream to file in current directory named 'node.txt'
    Use utf8 encoding
    Read the data in 16-kilobyte chunks
*/
var read = fs.createReadStream('./file.html', {
  encoding: 'utf-8',
  highWaterMark: 16 * 1024,
});
// create writable stream
var writeable = fs.createWriteStream('./file.log');
read.on('data', (chunks) => {
  writeable.write(chunks);
});

// copying with pipe()
/* Create readable stream to file in current directory named 'node.txt'
    Use utf8 encoding
    Read the data in 16-kilobyte chunks
*/
var read = fs.createReadStream('./file.html', {
  encoding: 'utf-8',
  highWaterMark: 16 * 1024,
});
// create writable stream
var write = fs.createWriteStream('./file.txt');
// use pipe to copy readable to writable
read.pipe(write);

// Reading from a file synchronously
let content;
try {
  content = fs.readFileSync('sync.txt', { encoding: 'utf8' });
} catch (err) {
  // An error occurred
  console.error(err);
}

// checking permission
/**
fs.constants.F_OK - Has read/write/execute permissions (If no mode is provided, this is the default)
fs.constants.R_OK - Has read permissions
fs.constants.W_OK - Has write permissions
fs.constants.X_OK - Has execute permissions (Works the same as fs.constants.F_OK on Windows)
 */
fs.access('./file.txt', fs.constants.F_OK, (error) => {
  if (error) {
    console.log(error);
  } else {
    // write to the file
    console.log('ok');
  }
});

// Check if we have read/write permissions
// When specifying multiple permission modes
// each mode is separated by a pipe : `|`
fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
  if (err) {
    console.log("%s doesn't exist", path);
  } else {
    console.log('can read/write %s', path);
  }
});

// checking permission synchronously
// fs.access also has a synchronous version fs.accessSync. When using fs.accessSync you must enclose it within a try/catch block.
try {
  fs.accessSync(path, fs.constants.W_OK);
  console.log('can write %s', path);
} catch (err) {
  console.log("%s doesn't exist", path);
}

// checking if a file or directory exists.
fs.stat('./file.html', (error) => {
  if (error) return console.log('file does not exist', error);
  console.log('file exists');
});

// Synchronously
// here, we must wrap the function call in a try/catch block to handle error.
try {
  fs.statSync('path/to/file');
  console.log('file or directory exists');
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('file or directory does not exist');
  }
}

// Readline
// Determining the line count in a file
var rl = readline.createInterface({
  input: fs.createReadStream('./file.html'),
  output: process.stdout,
  terminal: false,
});
var line = 0;
rl.on('line', () => {
  line++;
});
rl.on('close', () => {
  console.log('lines:', line);
});

// Line-by-line file reading
var rl = readline.createInterface({
  input: fs.createReadStream('./file.html'),
  output: process.stdout,
  terminal: false,
});
// Each new line emits an event - every time the stream receives \r, \n, or \r\n
rl.on('line', (line) => {
  console.log(line);
});
// The end of a file emits an event close.
rl.on('close', () => {
  console.log('Done reading file');
});

// Avoiding race conditions when creating or using an existing directory
/* Due to Node's asynchronous nature, creating or using a directory by first: checking for its existence with fs.stat(), then 1. creating or using it depending of the results of the existence check, 2. can lead to a race condition if the folder is created between the time of the check and the time of the creation. The method below wraps fs.mkdir() and fs.mkdirSync() in error-catching wrappers that let the exception pass if its code is EEXIST (already exists). If the error is something else, like EPERM (pemission denied), throw or pass an error like the native functions do.
 */
// Asynchronous version with fs.mkdir()
function mkdir(dirPath, callback) {
  fs.mkdir(dirPath, (err) => {
    callback(err && err.code !== 'EEXIST' ? err : null);
  });
}
mkdir('./existingDir', (err) => {
  if (err) return console.error(err.code);
  // Do something with `./existingDir` here
});
// Synchronous version with fs.mkdirSync()
function mkdirSync(dirPath) {
  try {
    fs.mkdirSync(dirPath);
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
}
mkdirSync('./existing-dir'); // Do something with `./existing-dir` now

// write to file using writeFile
var data = 'Hello world';
fs.writeFile('./hello.txt', data, (error) => {
  if (error) return console.log(error);
});

// write to file using writeSync
try {
  fs.writeFileSync('sync.txt', data, { mode: 0o755 });
} catch (err) {
  console.error(err);
}

// changing the contents of a file.
fs.readFile('./hello.txt', 'utf-8', function (error, data) {
  if (error) return console.log(error);
  var replace = data.replace(/hello/, 'hii');
  fs.writeFile('./hello.log', replace, (error) => {
    if (error) return console.log(error);
  });
});

// checking if a file exists
fs.stat('./file.html', (error) => {
  if (error) return console.log(error);
  // console.log('file exists');
});

// creating a directory
fs.mkdir('file.txt', (error) => {});

// deleting files using unlink
fs.unlink('./file.log', (error) => {
  if (error) return console.log(error);
});

// deleting files using unlinkSync
try {
  fs.unlinkSync('/path/to/file.txt');
  console.log('file deleted');
} catch (err) {
  console.err(error);
}

// reading file into a buffer
// This allows us to pipe this data to other locations or to process it as it comes in versus all at once at the end.
// Store file data chunks in this array
let chunks = [];
// We can use this variable to store the final data
let fileBuffer;
// Read file into stream.Readable
let fileStream = fs.createReadStream('text.txt');
// An error occurred with the stream
fileStream.once('error', (err) => {
  console.error(err);
});
// File is done being read
fileStream.once('end', () => {
  // create the final data Buffer from data chunks;
  fileBuffer = Buffer.concat(chunks);
  // Of course, you can do anything else you need to here, like emit an event!
});
// Data is flushed from fileStream in chunks,
// this callback will be executed for each chunk
fileStream.on('data', (chunk) => {
  chunks.push(chunk); // push data chunk to array
  // We can perform actions on the partial data we have so far!
});