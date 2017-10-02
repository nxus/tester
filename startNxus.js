require('babel-register')({
    ignore: /node_modules|nxus/
})

var application = require('nxus-core').application

application.start()
