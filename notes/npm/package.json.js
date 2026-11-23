/* 
  Package.json is it usually present in the root of the folder.
  It contains metadata about your app as well as the list of dependencies to install when running npm i install.
  To create a package.json we run the command (npm init-y or npm init --yes )
  To install a package and store it in the package.json we run (npm install package-name --save or npm i -S package-name)
  NPM aliases -S to --save and -D to --save-dev to save in your production or development dependencies respectively.
*/

/* Important properties of package.json
{
  "name": "module-name", -- this is the name of your module and it should be in all lowercase and not missing i.e your package will not install without it. it should be less than 214 characters not beginning with a dot or underscore.

  "version": "10.3.1", -- version of the software

  "description": "An example module to illustrate the usage of a package.json", -- The description of the project. Try to keep it short and concise.

  "author": "Your Name <your.name@example.org>", -- The author of this package.

  "contributors": [{
    "name": "Foo Bar",
    "email": "foo.bar@example.com"
  }], -- The contributors of this package.

  "bin": {
    "module-name": "./bin/module-name"
  }, -- An object which is used to expose binary scripts from your package. The object assumes that the key is the name of the binary script and the value a relative path to the script. This property is used by packages that contain a CLI (command line interface).

  "scripts": {
    "test": "vows --spec --isolate",
    "start": "node index.js",
    "predeploy": "echo About to deploy",
    "postdeploy": "echo Deployed",
    "prepublish": "coffee --bare --compile --output lib/foo src/foo/*.coffee"
  }, -- A object which exposes additional npm commands. The object assumes that the key is the npm command and the value is the script path. These scripts can get executed when you run npm run {command {command name}

  "main": "lib/foo.js", -- The main entry point to your package. When calling require( '{module name}') in node, this will be actual file that is required.

  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo"
  }, -- link to the repository where the code resides.

  "bugs": {
    "url": "https://github.com/username/issues"
  }, -- link to report any bugs in the software.

  "keywords": [
    "example"
  ], -- An array of keywords which describe your package. These will help people find your package

  "dependencies": {
    "express": "4.2.x"
  }, -- These are the dependencies that are only intended for development and testing of your module. The dependencies will be installed automatically unless the NODE_ENV=production environment variable has been set. If this is the case you can still these packages using npm install 

  "devDependencies": {
    "assume": "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0"
  },

  "peerDependencies": {
    "moment": ">2.0.0"
  },

  "preferGlobal": true, -- A property that indicates that this page prefers to be installed globally using  property is used by packages that contain a CLI (command line interface).In all other situations you should NOT use this property.publishConfig npm install -g { module-name}. This property is used by packages that contain a CLI (command line interface).

  "private": true,

  "publishConfig": {
    "registry": "https://your-private-hosted-npm.registry.domain.com"
  },

  "subdomain": "foobar",

  "analyze": true,

  "license": "MIT",

  "files": [
    "lib/foo.js"
  ] -- This is an array of all the files to include in the published package. Either a file path or folder path can be used. All the contents of a folder path will be included. This reduces the total size of your package by only including the correct files to be distributed. This field works in conjunction with a .npmignore rules file.
}
*/

// Scripts
/* 
  You can define scripts that can be executed or are triggered before or after another script.
  {
    "scripts": {
      "pretest": "scripts/pretest.js",
      "test": "scripts/test.js",
      "posttest": "scripts/posttest.js"
    }
  }
  In this case, you can execute the script by running either of these commands:
  $ npm run-script test
  $ npm run test
  $ npm test
  $ npm t

  Pre-defined scripts
  Script Name                              Description
  » prepublish :                           Run before the package is published.
  » publish, postpublish :                 Run after the package is published.
  » preinstall :                           Run before the package is installed.
  » install, postinstall :                 Run after the package is installed.
  » preuninstall, uninstall :              Run before the package is uninstalled.
  » postuninstall :                        Run after the package is uninstalled.
  » preversion, version :                  Run before bump the package version.
  » postversion :                          Run after bump the package version.
  » pretest, test, posttest :              Run by the npm test command
  » prestop, stop, poststop :              Run by the npm stop command
  » prestart, start, poststart :           Run by the npm start command
  » prerestart, restart, postrestart :     Run by the npm restart command

  User-defined scripts
  {
    "scripts": {
      "preci": "scripts/preci.js",
      "ci": "scripts/ci.js",
      "postci": "scripts/postci.js"
    }
  }
  In this case, you can execute the script by running either of these commands:
  $ npm run-script ci
  $ npm run ci

*/

/**
  Basic project definition
  {
      "name": "my-project",
      "version": "0.0.1",
      "description": "This is a project.",
      "author": "Someone <someone@example.com>",
      "contributors": [{
          "name": "Someone Else",
          "email": "else@example.com"
      }],
      "keywords": ["improves", "searching"]
  }
*/

/**
  Dependencies
  "dependencies": { "module-name": "0.1.0" }
  » exact: 0.1.0 will install that specific version of the module.
  » newest minor version: ^0.1.0 will install the newest minor version, for example 0.2.0, but won't install a module with a higher major version e.g. 1.0.0
  » newest patch: 0.1.x or ~0.1.0 will install the newest patch version available, for example 0.1.4, but won't install a module with higher major or minor version, e.g. 0.2.0 or 1.0.0.
  » wildcard: * will install the latest version of the module.
  » git repository: the following will install a tarball from the master branch of a git repo. A #sha, #tag or
  #branch can also be provided:
  GitHub: user/project or user/project#v1.0.0
  url: git://gitlab.com/user/project.git or git://gitlab.com/user/project.git#develop
  » local path: file:../lib/project

  After adding them to your package.json, use the command npm install in your project directory in terminal.
*/

/**
  Extended project definition
  Some of the additional attributes are parsed by the npm website like repository, bugs or homepage and shown in the infobox for this packages
  {
    "main": "server.js",  
    "repository" :  {
      "type": "git",
      "url": "git+https://github.com/<accountname>/<repositoryname>.git"
    },
    "bugs": {
      "url": "https://github.com/<accountname>/<repositoryname>/issues"
    },
    "homepage": "https://github.com/<accountname>/<repositoryname>#readme",
    "files": [
      "server.js", // source files
      "README.md", // additional files
      "lib" // folder with all included files
    ]
  }
 */
