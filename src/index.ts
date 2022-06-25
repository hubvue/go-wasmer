import { isBrowser } from '@cckim/utils'
import { runWasmInNode } from './node'
import { runWasmInBrowser } from './browser'

export const runWasm = (wasmFilePath: string, args: unknown[] = []) => {
  if (isBrowser()) {
    return runWasmInBrowser(wasmFilePath, args)
  }
  return runWasmInNode(wasmFilePath, args)
}
