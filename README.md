# @nxus/tester
A test management framework for Nxus applications.  The tester module provides some helper functions for funtionally testing a Nxus app.

## Installation
```
> npm install @nxus/tester --save-dev
```

## Configuration

In order to spin up the test server, add the following lines to your package.json `scripts`.

```
"pretest": "./node_modules/forever/bin/forever stopall && NODE_ENV=test PORT=3001 ./node_modules/forever/bin/forever start index.js && sleep 15"
```

```
"posttest": "./node_modules/forever/bin/forever stop index.js"
```

## Usage

### Running tests

```
> npm test
```

### Requests

```
import {request} from '@nxus/tester'

request.get({url: '/'}, (err, res, body) => {
  res.statusCode.should.equal(200)
})
```

## API

Included are the following helper methods:

* request(): a preconfigured `request` instance for making http calls to the test server.
* create_user(username, password): creates an arbitrary user
* request_login(username, password): logs in and sets up a session for the 
