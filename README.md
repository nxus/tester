# @nxus/tester

## 

[![Build Status](https://travis-ci.org/nxus/tester.svg?branch=master)](https://travis-ci.org/nxus/tester)

A test management framework for Nxus applications.  The tester module provides some helper functions for funtionally testing a Nxus app.

### Installation

    > npm install @nxus/tester --save-dev

### Configuration

In order to spin up the test server, add the following lines to your package.json `scripts`.

    "pretest": "./node_modules/forever/bin/forever stopall && NODE_ENV=test PORT=3001 ./node_modules/forever/bin/forever start index.js && sleep 15"

    "posttest": "./node_modules/forever/bin/forever stop index.js"

### Usage

#### Running tests

    > npm test

#### Requests

    import {request} from '@nxus/tester'

    request.get({url: '/'}, (err, res, body) => {
      res.statusCode.should.equal(200)
    })

## API

* * *
