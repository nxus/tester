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
 * In order to spin up the test server, add the following lines to your package.json `scripts`.
 * 
 *     "pretest": "forever stopall && NODE_ENV=test PORT=3002 forever start index.js && sleep 15"
 * 
 *     "posttest": "forever stop index.js"
 * 
 * ## Usage
 * 
 * ### Running tests
 * 
 *     > npm test
 * 
 * ### Requests
 * 
 *     import {request} from 'nxus-tester'
 * 
 *     request.get({url: '/'}, (err, res, body) => {
 *       res.statusCode.should.equal(200)
 *     })
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
import process from 'process'
import fs_ from 'fs'
const fs = Promise.promisifyAll(fs_)

import {NxusModule, application as app} from 'nxus-core'
import {dataManager} from 'nxus-data-manager'

import testServer from './testServer'

const REGEX_FILE = /[^\/\~]$/;

var base = 'http://localhost:3002/'

class Tester extends NxusModule {
  constructor() {
    super()
    this._loadLocalFixtures()
    app.onceAfter('launch', () => {
      if (process.send) {
        this.log.debug("Signalling parent process that server has launched")
        process.send({nxus: {launched: true}})
      }
    })
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

async function create_user (username, password = 'test') {
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

function request_login (username, password = 'test') {
  var jar = request.jar()
  var req = request.defaults({jar: jar})
  req.cookieJar = jar
  return req.post({
    url: '/login',
    form: {
      username: username,
      password: password
    },
    followRedirect: false
  })
}

export {Tester as default, tester, request, testServer, create_user, request_login, base}
