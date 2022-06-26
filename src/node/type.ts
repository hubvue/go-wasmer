export type SendMessage = {
  wasmFile: string
  args: unknown[]
}

export interface ReceiveMessage {
  type: MessageType
  message: unknown
}

export enum MessageType {
  Error = 'error',
  Message = 'message'
}
