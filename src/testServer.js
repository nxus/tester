import Promise from 'bluebird'
import process from 'process'
import path from 'path'

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
    application = require(p)
    application.onceAfter("launch", () => {
      resolve()
    })
  })
  return waiting
}
