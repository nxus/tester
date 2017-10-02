/* 
* @Author: Mike Reich
* @Date:   2016-02-09 10:17:43
* @Last Modified 2016-02-09
*/

'use strict';

import Tester from '../src'
import {testServer, request, create_user, request_login} from '../src'

describe("Tester", () => {
  describe("Load", () => {
    it("should not be null", () => Tester.should.not.be.null)

    it("should have request", () => {
      request.should.not.be.null
    });

    it("should have create_user", () => {
      create_user.should.not.be.null
    });

    it("should have request_login", () => {
      request_login.should.not.be.null
    });
    it("should have testServer", () => testServer.should.not.be.null)
  });
  describe("testServer", function() {
    let server
    before(async function() {
      this.timeout(10000)
      server = await testServer('startNxus.js', "3002", "nxus:*")
    })
    it("should await startup", async function() {
      let body = await request.get({
        url: '/',
      })
      console.log("Body", body)
      body.should.contain("Home")
    })
  })

});
