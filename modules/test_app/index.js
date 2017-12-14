var NxusModule =  require('nxus-core').NxusModule
var router = require('nxus-router').router

class TestApp extends NxusModule {
  constructor() {
    super()
    router.route('/', (req, res) => {
      res.send("Home")
    })
  }
  
}

module.exports = TestApp
