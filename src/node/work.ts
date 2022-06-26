import { getCache, GoWasm, hasCache, setCache } from '../utils/cache'
import { SendMessage, MessageType } from './type'

const initChildMessage = () => {
  process.on('message', async (message: SendMessage) => {
    try {
      if (message) {
        await runWasm(message.wasmFile, message.args)
      }
    } catch(err) {
      if (process.send) {
        process.send({
          type: MessageType.Error,
          message: err
        })
      }
    }
  })

}

initChildMessage()

const initWasmEnv = async () => {
  const initEnv = await import('../../internal/wasm_node_init')
  initEnv.default()
  const initGoWasm = await import('../../internal/wasm_exec')
  initGoWasm.default()
}

const runWasm = async (wasmFilePath: string, args: unknown[] = []) => {
  await initWasmEnv()
  let wasm: GoWasm | undefined

  if (hasCache(wasmFilePath)) {
    wasm = getCache(wasmFilePath)
  } else {
    wasm = await createNodeGoWasm(wasmFilePath)
    if (wasm) {
      setCache(wasmFilePath, wasm)
    }
  }

  if (!wasm) {
    if (process.send) {
      process.send({
        type: MessageType.Error,
        message: '[Go Wasm]: WebAssembly file failed to load'
      })
    }
    return
  }

  wasm.go.argv = [wasmFilePath, ...args]

  await wasm.go.run(wasm.instance)
  wasm.instance = await WebAssembly.instantiate(
    wasm.module,
    wasm.go.importObject
  ) // reset instance
}

const createNodeGoWasm = (wasmFilePath: string): Promise<GoWasm | undefined> => {
  const fs = require('fs')
  const go = new Go()
  
  go.env = Object.assign({ TMPDIR: require('os').tmpdir() }, process.env)
  go.exit = process.exit

  const wasmFile = fs.readFileSync(wasmFilePath)
  return WebAssembly.instantiate(wasmFile, go.importObject)
    .then(async (result) => {
      process.on('exit', (code) => {
        if (code === 0 && !go.exited) {
          go._pendingEvent = { id: 0 }
          go._resume()
        }
      })
      return {
        go,
        module: result.module,
        instance: result.instance
      }
    })
    .catch((err) => {
      if (process.send) {
        process.send({
          type: MessageType.Error,
          message: `[Go Wasm]: ${err}`
        })
      }
      return undefined
    })
}
