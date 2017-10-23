
# Guideline

- [Setup](#setup)
  > NPM for development environment
- [Developerment](#developerment)
  > Gulp is used for task runner
- [Test](#testing)
  > npm install -g selenium-standalone


<a id='setup'></a>

## Setup:

you must have these tools to read, maintain or deploy js,html,scss to align pattern and keep project consistent

  > After set up, cmd goto developerment folder, and npm install

* [NodeJs](https://nodejs.org/en/)
* [npm](https://docs.npmjs.com/cli/install)
* [Gulp](https://travismaynard.com/writing/getting-started-with-gulp)
* [codeceptjs](http://codecept.io/quickstart/)



<a id='developerment'></a>

## Developerment:

> Open project in CMD and type:

Install package from npm

1. ```$ cd path/to/project root with package.json/```
2. ```$ npm install```

Run Task runner
1.  ```$ npm test```


<a id='testing'></a>

## Code review

Deepscan used in project.
[![DeepScan Grade](https://deepscan.io/api/projects/630/branches/992/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=630&bid=992)

<!--
## Testing (unit test):

  Require tools :
1. Mocha (global)
```npm install -g mocha ```

2. chai (dev)
``` npm install chai --save-dev```

Run : -->
<!-- ```codeceptjs run --steps``` -->


## Testing (end to end):

Require tools :
1. codeceptjs (global)
```npm install -g codeceptjs-webdriverio```

2. Selenium Server (global)
``` npm install -g selenium-standalone```
```selenium-standalone install```



Run :
```selenium-standalone start```
```codeceptjs run --steps```








