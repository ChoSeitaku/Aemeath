// Bun-compatible stdin handler
// Uses 'readable' event instead of 'data' event for better backpressure control
// Handles raw mode reference counting like Claude Code

import { EventEmitter } from 'events'

export type Key = {
  ctrl: boolean
  meta: boolean
  shift: boolean
  name: string
  sequence?: string
}

type StdinHandlerOptions = {
  stdin: NodeJS.ReadStream
  stdout: NodeJS.WriteStream
  onKey: (key: Key) => void
  onRawData: (data: Buffer) => void
}

// Reference-counted raw mode manager
export class StdinHandler {
  private stdin: NodeJS.ReadStream
  private stdout: NodeJS.WriteStream
  private onKey: (key: Key) => void
  private onRawData: (data: Buffer) => void
  private rawModeCount = 0
  private readableHandler: (() => void) | null = null
  private keyBuffer = ''
  private isPaused = false

  constructor(options: StdinHandlerOptions) {
    this.stdin = options.stdin
    this.stdout = options.stdout
    this.onKey = options.onKey
    this.onRawData = options.onRawData
  }

  // Enable raw mode (reference counted)
  setRawMode(enabled: boolean): void {
    if (enabled) {
      this.rawModeCount++
      if (this.rawModeCount === 1) {
        this.enableRawMode()
      }
    } else {
      this.rawModeCount--
      if (this.rawModeCount === 0) {
        this.disableRawMode()
      }
    }
  }

  // Check if raw mode is supported
  isRawModeSupported(): boolean {
    return this.stdin.isTTY === true
  }

  private enableRawMode(): void {
    if (this.stdin.setRawMode) {
      this.stdin.setRawMode(true)
    }

    // Use 'readable' event for better backpressure control
    this.readableHandler = () => {
      this.handleReadable()
    }
    this.stdin.on('readable', this.readableHandler)

    // Enable bracketed paste mode
    this.stdout.write('\x1b[?2004h')
  }

  private disableRawMode(): void {
    if (this.readableHandler) {
      this.stdin.removeListener('readable', this.readableHandler)
      this.readableHandler = null
    }

    if (this.stdin.setRawMode) {
      this.stdin.setRawMode(false)
    }

    // Disable bracketed paste mode
    this.stdout.write('\x1b[?2004l')
  }

  private handleReadable(): void {
    if (this.isPaused) return

    try {
      let chunk: Buffer | null
      while ((chunk = this.stdin.read()) !== null) {
        if (chunk.length === 0) continue

        this.onRawData(chunk)

        // Parse key sequences
        const str = chunk.toString('utf-8')
        this.parseKeySequence(str)
      }
    } catch (error) {
      // Bun stream error recovery
      // In Bun, an uncaught throw inside a stream 'readable' handler can
      // permanently wedge the stream. Catching here ensures the stream stays healthy.
      console.error('Stdin read error:', error)
    }
  }

  private parseKeySequence(data: string): void {
    this.keyBuffer += data

    // Process complete sequences
    while (this.keyBuffer.length > 0) {
      const key = this.extractKey()
      if (key) {
        this.onKey(key)
      } else {
        break
      }
    }
  }

  private extractKey(): Key | null {
    const buf = this.keyBuffer
    if (buf.length === 0) return null

    // Escape sequence
    if (buf[0] === '\x1b') {
      // ESC [ sequences (CSI)
      if (buf.length >= 2 && buf[1] === '[') {
        // Arrow keys: ESC [ A/B/C/D
        if (buf.length >= 3 && /[ABCD]/.test(buf[2]!)) {
          const name = { A: 'up', B: 'down', C: 'right', D: 'left' }[buf[2]!]!
          this.keyBuffer = buf.slice(3)
          return { ctrl: false, meta: false, shift: false, name }
        }

        // Home/End: ESC [ H/F or ESC [ 1~ / ESC [ 4~
        if (buf.length >= 3) {
          if (buf[2] === 'H') {
            this.keyBuffer = buf.slice(3)
            return { ctrl: false, meta: false, shift: false, name: 'home' }
          }
          if (buf[2] === 'F') {
            this.keyBuffer = buf.slice(3)
            return { ctrl: false, meta: false, shift: false, name: 'end' }
          }
          // ESC [ 1~ = Home, ESC [ 4~ = End, ESC [ 3~ = Delete
          if (buf[2] === '1' && buf.length >= 4 && buf[3] === '~') {
            this.keyBuffer = buf.slice(4)
            return { ctrl: false, meta: false, shift: false, name: 'home' }
          }
          if (buf[2] === '4' && buf.length >= 4 && buf[3] === '~') {
            this.keyBuffer = buf.slice(4)
            return { ctrl: false, meta: false, shift: false, name: 'end' }
          }
          if (buf[2] === '3' && buf.length >= 4 && buf[3] === '~') {
            this.keyBuffer = buf.slice(4)
            return { ctrl: false, meta: false, shift: false, name: 'delete' }
          }
        }

        // Wait for more data
        return null
      }

      // ESC O sequences (SS3) - F1-F4
      if (buf.length >= 2 && buf[1] === 'O') {
        if (buf.length >= 3) {
          const name = { P: 'f1', Q: 'f2', R: 'f3', S: 'f4' }[buf[2]!]
          if (name) {
            this.keyBuffer = buf.slice(3)
            return { ctrl: false, meta: false, shift: false, name }
          }
        }
        return null
      }

      // Alt+key: ESC + printable char
      if (buf.length >= 2 && buf.charCodeAt(1) >= 32) {
        const ch = buf[1]!
        this.keyBuffer = buf.slice(2)
        return {
          ctrl: false,
          meta: true,
          shift: false,
          name: ch.toLowerCase(),
          sequence: buf.slice(0, 2),
        }
      }

      // Bare ESC
      if (buf.length === 1) {
        // Wait for more data in case it's a sequence
        return null
      }
    }

    // Ctrl+key combinations
    const ch = buf.charCodeAt(0)
    if (ch < 32) {
      // Control characters
      let name: string
      let ctrl = true

      if (ch === 13) {
        name = 'return'
        ctrl = false
      } else if (ch === 9) {
        name = 'tab'
        ctrl = false
      } else if (ch === 127 || ch === 8) {
        name = 'backspace'
        ctrl = false
      } else if (ch === 3) {
        name = 'c'
      } else if (ch === 4) {
        name = 'd'
      } else if (ch === 26) {
        name = 'z'
      } else {
        name = String.fromCharCode(ch + 96) // Convert to letter
      }

      this.keyBuffer = buf.slice(1)
      return { ctrl, meta: false, shift: false, name }
    }

    // Regular printable character
    this.keyBuffer = buf.slice(1)
    return {
      ctrl: false,
      meta: false,
      shift: ch >= 65 && ch <= 90, // Uppercase letters
      name: buf[0]!,
      sequence: buf[0],
    }
  }

  // Suspend stdin reading (for external TUI handoff)
  suspend(): void {
    this.isPaused = true
  }

  // Resume stdin reading
  resume(): void {
    this.isPaused = false
  }

  // Cleanup
  destroy(): void {
    this.disableRawMode()
  }
}

// Create a stdin handler
export function createStdinHandler(options: StdinHandlerOptions): StdinHandler {
  return new StdinHandler(options)
}
