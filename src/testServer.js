import Promise from 'bluebird'
import process from 'process'
import path from 'path'

import {application} from 'nxus-core'

/**
 * Start a test server
 */

let waiting

/**
 * Import a data file as fixture data for tests. Only runs if config.env==test
 * @param {string} script The entrypoint filename relative to cwd
 * @param {object} options additional ENV variables (override test database names, etc)
 * @return {Promise} resolves when application has started
 */
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
    require(p)
    application.onceAfter("launch", () => {
      resolve()
    })
  })
  return waiting
}
