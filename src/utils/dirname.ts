import { dirname } from 'path'
import { fileURLToPath } from 'url'

export const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath('./'))
