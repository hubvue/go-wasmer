import { fork } from 'child_process'
import { resolve } from 'path'
import { MessageType, ReceiveMessage, SendMessage } from './type'
import { _dirname } from '../utils/dirname'

/**
 * @description initial worker
 */


/**
 * @description Loading go applications via WebAssembly in a nodejs environment
 * @param wasmFilePath
 * @param args
 * @returns
 */
export const runWasmInNode = (wasmFilePath: string, args: unknown[] = []) => {
  let timer: NodeJS.Timeout | null
  const childProcess = fork(resolve(_dirname, './node/work.js'), [], { stdio: 'pipe'})
  return new Promise((resolve, reject) => {
    // exit
    process.on('exit', () => {
      if (childProcess.connected) {
        childProcess.disconnect()
        if (!childProcess.killed) {
          childProcess.kill()
        }
      }
    })
    // listening stdout data
    childProcess.stdout?.on('data', (data) => {
      timer = setTimeout(() => {
        resolve(data.toString())
      }, 10)
    })
    // listening stderr data
    childProcess.stderr?.on('data', (data) =>{
      if (timer) {
        clearTimeout(timer)
      }
      reject(data.toString())
    })
    // error
    childProcess.on('error', (err) => {
      if (err) {
        reject(err)
      }
    })
    // message
    childProcess.on('message', (data: ReceiveMessage) => {
      switch (data.type) {
        case MessageType.Error:
          reject(data.message)
          break
        case MessageType.Message:
          resolve(data.message)
          break
        default:
          resolve(data.message)
      }
    })

    const message: SendMessage = {
      wasmFile: wasmFilePath,
      args
    }
    childProcess.send(message, (err) => {
      if (err) {
        reject(err)
      }
    })
  })
}

