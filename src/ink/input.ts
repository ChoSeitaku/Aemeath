// Global input context for Ink Bun compatibility layer
// Bridges stdin keystrokes to React state

export type InputCallback = (event: InputEvent) => void

export type InputEvent =
  | { type: 'char'; char: string }
  | { type: 'return' }
  | { type: 'backspace' }
  | { type: 'delete' }
  | { type: 'tab' }
  | { type: 'up' }
  | { type: 'down' }
  | { type: 'left' }
  | { type: 'right' }
  | { type: 'home' }
  | { type: 'end' }
  | { type: 'ctrl+c' }
  | { type: 'ctrl+d' }
  | { type: 'paste'; text: string }

// The rerender callback is set by render() and never overwritten
let rerenderFn: (() => void) | null = null

// The input callback is set by useInput hooks (can be overwritten)
let inputCallback: InputCallback | null = null

export function setRerenderCallback(fn: () => void): void {
  rerenderFn = fn
}

export function clearRerenderCallback(): void {
  rerenderFn = null
}

export function registerInputCallback(cb: InputCallback): void {
  inputCallback = cb
}

export function unregisterInputCallback(): void {
  inputCallback = null
}

export function dispatchInputEvent(event: InputEvent): void {
  if (inputCallback) {
    inputCallback(event)
  }
  // Always trigger rerender after input
  if (rerenderFn) {
    rerenderFn()
  }
}
