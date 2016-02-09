/* 
* @Author: Mike Reich
* @Date:   2016-02-09 10:17:43
* @Last Modified 2016-02-09
*/

'use strict';

var Tester = require('../src')

describe("Tester", () => {
  describe("Load", () => {
    it("should not be null", () => Tester.should.not.be.null)

    it("should have request", () => {
      Tester.should.have.property('request')
    });

    it("should have create_user", () => {
      Tester.should.have.property('create_user')
    });

    it("should have request_login", () => {
      Tester.should.have.property('request_login')
    });
  });
});