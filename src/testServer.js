import Promise from 'bluebird'
import child_process from 'child_process'
import process from 'process'
import path from 'path'

/**
 * Start a test server
 */

export default function testServer(script="index.js", port="3002", debug="") {
  let cwd = process.cwd()
  let p = path.resolve(cwd, script)
  let child = child_process.fork(p, [], {env: {PORT: port, CWD: cwd, DEBUG: debug}})
  process.on('exit', () => {
    child.kill()
  })
  return new Promise((resolve, reject) => {
    child.on('message', (message) => {
      if (message.nxus && message.nxus.launched) {
        resolve(child)
      }
    })
  })
}
