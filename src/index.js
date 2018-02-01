/* 
* @Author: Mike Reich
* @Date:   2016-02-05 08:28:40
* @Last Modified 2016-05-19
*/
/**
 * [![Build Status](https://travis-ci.org/nxus/tester.svg?branch=master)](https://travis-ci.org/nxus/tester)
 * 
 * A test management framework for Nxus applications.  The tester module provides some helper functions for funtionally testing a Nxus app.
 * 
 * ## Installation
 * 
 *     > npm install nxus-tester --save-dev
 * 
 * ## Configuration
 * 
 * You will want to use `mocha` as your test runner in your application project, here's a standard npm `test` script for your `package.json`
 * 
 *     "test": "NODE_ENV=test mocha --recursive --compilers js:babel-register -R spec modules/test/*",
 * 
 * ## Usage
 * 
 * ### Test Server startup
 * 
 * Any test suites that want to make requests to a running instance of your application should use `startTestServer`:
 * 
 *     describe("My App", function() {
 *         before(function() {
 *             this.timeout(4000) // Depending on your apps startup speed
 *             startTestServer()
 *         })
 *         ... // Your tests
 *     })
 * 
 * This is safe to call in multiple suites, only one test server will be started. You may pass an object as an
 * optional second argument to `startTestServer` for command ENV variables, such as DEBUG.
 * 
 * ### Running tests
 * 
 *     > npm test
 * 
 * ### Requests
 * 
 * Requests to the test server can be made using helper methods for the `requests-with-promises` library.
 * 
 *     import {request, requestRaw, requestLogin} from 'nxus-tester'
 * 
 * `request` returns the body of a successful response
 *     
 *     let body = await request.get('/') // or request({url: '/', ...})
 *     res.statusCode.should.equal(200)
 *     
 * or errors with a non-2XX response
 *     
 *     let body = await request.get('/notHere')
 *      .catch(request.errors.StatusCodeError, (err) => {...})
 * 
 * `requestRaw` returns the response object, if you want to check statusCode, headers, etc
 *     let res = await requestRaw.get({url: '/admin', followRedirect: false})
 *     res.statusCode.should.equal(302)
 *     res.headers.location.should.contain('/login')
 * 
 * 
 * `requestLogin`` creates a new cookie jar and logs in as the requested username/password
 * and returns a request object to use like `request`.
 *     let req = await requestLogin('user@dev', 'test')
 *     let body = await req.get({url: '/admin'})
 * 
 * ### Fixtures
 * 
 * You can define fixtures (json or csv files with data to load during test startup) manually in your application modules:
 *     app.get('tester').fixture('modelName', 'path/to/fixture.json')
 * 
 * Or by creating a top-level application `fixtures` directory with files named for the models they contain fixture data for.
 * 
 * 
 * # API
 * -----
 */
'use strict';

import Promise from 'bluebird'
import request_lib from 'request-promise-native'
import request_errors from 'request-promise-native/errors'
import pluralize from 'pluralize'
import path from 'path'
import fs_ from 'fs'
const fs = Promise.promisifyAll(fs_)

import {NxusModule, application as app} from 'nxus-core'
import {dataManager} from 'nxus-data-manager'

import startTestServer from './testServer'

const REGEX_FILE = /[^\/\~]$/;

var base = 'http://localhost:3002/'

class Tester extends NxusModule {
  constructor() {
    super()
    this._loadLocalFixtures()
  }

  /**
   * Import a data file as fixture data for tests. Only runs if config.env==test
   * @param {string} modelId The identity of the model to import
   * @param {string} path The path to a file
   * @param {object} options Options to pass to data-loader.importFile
   */
  fixture(modelId, path, options) {
    if(app.config.NODE_ENV == 'test') {
      this.log.debug("Loading fixture", path, "for model", modelId)
      return app.once('startup', () => {
        return dataLoader.importFileToModel(modelId, path, options)
      })
    }
  }

  _loadLocalFixtures() {
    let dir = path.resolve("./fixtures");
    try {
      fs.accessSync(dir)
    } catch (e) {
      return;
    }
    return fs.readdirAsync(dir).each((file) => {
      if (REGEX_FILE.test(file)) {
        let ext = path.extname(file)
        let p = path.resolve(path.join(dir,file))
        let model = pluralize.singular(path.basename(file, ext))
        this.provide('fixture', model, p)
      }
    });
    
  }
}
var tester = Tester.getProxy()

var request = request_lib.defaults({baseUrl: base})
request.errors = request_errors
var requestRaw = request.defaults({resolveWithFullResponse: true, simple: false})

async function createUser (username, password = 'test') {
  // TODO check for existing user, API?
  let req = await request_login('admin@nxus.org', 'admin')
  await req.post({
    url: '/admin/users/save',
    form: {
      email: username,
      password: password
    }
  })
  return request_login(username, password)
}

async function requestLogin (username, password = 'test') {
  var jar = request.jar()
  var req = request.defaults({jar: jar})
  req.cookieJar = jar
  await req.post({
    url: '/login',
    form: {
      username: username,
      password: password
    },
    simple: false,
    followRedirect: false
  })
  return req
}

export {Tester as default, tester, request, requestRaw, startTestServer, createUser, requestLogin, base}
