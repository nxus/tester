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
 *     import {request} from '@nxus/tester'
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
import request_lib from 'request'
import pluralize from 'pluralize'
import path from 'path'
import fs_ from 'fs'
const fs = Promise.promisifyAll(fs_);

const REGEX_FILE = /[^\/\~]$/;

var base = 'http://localhost:3002/'

export default class Tester {
  constructor(app) {
    this.app = app
    this.app.get('tester').use(this)
      .gather('fixture')

    this._loadLocalFixtures()
  }

  /**
   * Import a data file as fixture data for tests. Only runs if config.env==test
   * @param {string} modelId The identity of the model to import
   * @param {string} path The path to a file
   * @param {object} options Options to pass to data-loader.importFile
   */
  fixture(modelId, path, options) {
    if(this.app.config.NODE_ENV == 'test') {
      this.app.log.debug("Loading fixture", path, "for model", modelId)
      return this.app.once('startup', () => {
        return this.app.get('data-loader').importFileToModel(modelId, path, options)
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


export var request = request_lib.defaults({baseUrl: base})

export var create_user = (username, password = 'test') => {
  // TODO check for existing user, API?
  return request_login('admin@nxus.org', 'admin')
  .then((req) => {
    return new Promise((resolve, reject) => {
      req.post(
        {
          url: '/admin/users/save',
          form: {
            email: username,
            password: password
          }
        },
        (err, res, body) => {
          if (err) { reject(err) }
          resolve(request_login(username, password))
        })
    })
  }) 
}

export var request_login = (username, password = 'test') => {
  var jar = request.jar()
  var req = request.defaults({jar: jar})
  req.cookieJar = jar
  return new Promise((resolve, reject) => {
    req.post(
      {
        url: '/login',
        form: {
          username: username,
          password: password
        },
        followRedirect: false
      },
      (err, res, body) => {
        if (err) { reject(err) }
        resolve(req)
      })
  })
}
