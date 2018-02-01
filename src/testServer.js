import Promise from 'bluebird'
import process from 'process'
import path from 'path'

import {application as app} from 'nxus-core'

/**
 * Start a test server
 */

let waiting

export default function startTestServer(script="index.js", env={}) {

  if (waiting) {
    return waiting
  }
  
  waiting = new Promise((resolve, reject) => {
    let cwd = process.cwd()
    let p = path.resolve(cwd, script)

    process.env.PORT = "3002"
    for (let k in env) {
      process.env[k] = env[k]
    }
    let application = require(p)
    app.onceAfter("launch", () => {
      resolve()
    })
  })
  return waiting
}
