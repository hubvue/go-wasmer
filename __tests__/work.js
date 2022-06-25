const { fork } = require('child_process')


const child = fork('./index.js', [], { stdio: 'pipe'})

child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})
