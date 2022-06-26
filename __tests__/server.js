const { createServer} = require('http')
const { runWasm } = require('../dist/index.js')

createServer(async (req, res) => {
  const result = await runWasm('./add.wasm', [Math.random() * 100 >> 0, Math.random() * 100 >> 0])
  res.end('Hello world' + result)
}).listen(8000)
