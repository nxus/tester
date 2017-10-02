/* 
* @Author: Mike Reich
* @Date:   2016-02-09 10:17:43
* @Last Modified 2016-02-09
*/

'use strict';

import Tester from '../src'
import {testServer, request, requestRaw, createUser, requestLogin} from '../src'

describe("Tester", () => {
  describe("Load", () => {
    it("should not be null", () => Tester.should.not.be.null)

    it("should have request", () => {
      request.should.not.be.null
    });
    it("should have requestRaw", () => {
      requestRaw.should.not.be.null
    });

    it("should have createUser", () => {
      createUser.should.not.be.null
    });

    it("should have requestLogin", () => {
      requestLogin.should.not.be.null
    });
    it("should have testServer", () => testServer.should.not.be.null)
  });
  describe("testServer", function() {
    let server
    before(async function() {
      this.timeout(10000)
      server = await testServer('startNxus.js')
    })
    it("should await startup", async function() {
      let body = await request.get({
        url: '/',
      })
      body.should.contain("Home")
    })
  })

});
