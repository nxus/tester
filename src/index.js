/* 
* @Author: Mike Reich
* @Date:   2016-02-05 08:28:40
* @Last Modified 2016-02-20
*/
/**
 * [![Build Status](https://travis-ci.org/nxus/tester.svg?branch=master)](https://travis-ci.org/nxus/tester)
 * 
 * A test management framework for Nxus applications.  The tester module provides some helper functions for funtionally testing a Nxus app.
 * 
 * ## Installation
 * 
 *     > npm install @nxus/tester --save-dev
 * 
 * ## Configuration
 * 
 * In order to spin up the test server, add the following lines to your package.json `scripts`.
 * 
 *     "pretest": "./node_modules/forever/bin/forever stopall && NODE_ENV=test PORT=3001 ./node_modules/forever/bin/forever start index.js && sleep 15"
 * 
 *     "posttest": "./node_modules/forever/bin/forever stop index.js"
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
 * # API
 * -----
 */
'use strict';

import Promise from 'bluebird'
import request_lib from 'request'

var base = 'http://localhost:3001/'

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

export default () => {

}
