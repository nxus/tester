# nxus-tester

## 

[![Build Status](https://travis-ci.org/nxus/tester.svg?branch=master)](https://travis-ci.org/nxus/tester)

A test management framework for Nxus applications.  The tester module provides some helper functions for funtionally testing a Nxus app.

### Installation

    > npm install nxus-tester --save-dev

### Configuration

In order to spin up the test server, add the following lines to your package.json `scripts`.

    "pretest": "./node_modules/forever/bin/forever stopall && NODE_ENV=test PORT=3002 ./node_modules/forever/bin/forever start index.js && sleep 15"

    "posttest": "./node_modules/forever/bin/forever stop index.js"

### Usage

#### Running tests

    > npm test

#### Requests

    import {request} from '@nxus/tester'

    request.get({url: '/'}, (err, res, body) => {
      res.statusCode.should.equal(200)
    })

#### Fixtures

You can define fixtures (json or csv files with data to load during test startup) manually in your application modules:
    app.get('tester').fixture('modelName', 'path/to/fixture.json')

Or by creating a top-level application `fixtures` directory with files named for the models they contain fixture data for.

## API

* * *

## fixture

Import a data file as fixture data for tests. Only runs if config.env==test

**Parameters**

-   `modelId` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The identity of the model to import
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The path to a file
-   `options` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Options to pass to data-loader.importFile
