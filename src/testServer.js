import Promise from 'bluebird'
import child_process from 'child_process'
import process from 'process'
import path from 'path'

/**
 * Start a test server
 */

let _child, waiting

export default function testServer(script="index.js", env={}) {
  if (_child) {
    return _child
  }
  if (waiting) {
    return waiting
  }
  
  waiting = new Promise((resolve, reject) => {
    let cwd = process.cwd()
    let p = path.resolve(cwd, script)
    let defaultEnv = {CWD: cwd, PORT: "3002"}
    let child = child_process.fork(p, [], {env: Object.assign(defaultEnv, env)})
    process.on('exit', () => {
      child.kill()
    })
    child.on('message', (message) => {
      if (message.nxus && message.nxus.launched) {
        resolve(child)
        _child = child
      }
    })
  })
  return waiting
}
