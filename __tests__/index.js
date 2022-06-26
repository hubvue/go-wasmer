const { runWasm } = require('../dist/index.js')

const run = async () => {
  try {
    console.time('wasm1')
    // process.stdout.on('data', (...args) => {
    //   console.log('data', args)
    // })
    // process.stdin.on('data', (...args) => {
    //   console.log('data', args)
    // })
    const result = await runWasm('./add.wasm', [1, 2])
    console.log('result1', result.toString())
    console.timeEnd('wasm1')
    
    console.log('1111')
    console.time('wasm2')
    
    const result2 = await runWasm('./add.wasm', [3, 4])
    console.log('result2', result2)
    console.timeEnd('wasm2')
  } catch(err) {
    console.log('run:err', err)
  }
}

run()
