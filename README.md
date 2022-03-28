# go-wasmer

Run Go projects in nodejs and browser environments by way of WebAssembly.

### Install

```shell
// pnpm
pnpm add @cckim/go-wasmer
//yarn
yarn add @cckim/go-wasmer
// npm
npm install @cckim/go-wasmer
```

### Usage

```ts
import { runWasm } from '@cckim/go-wasmer';
runWasm('./add.wasm', [1, 2])
  .then(res => console.log(res))
// 3
```

#### Note

Due to the nature of Go wasm having to be an executable program, it will output the results to the console by default. In a browser environment, `go-wasmer` gets its output by intercepting `console.log`, but it doesn't seem to be able to do this in a nodejs environment, and will also output the results to the console.

### License
MIT
