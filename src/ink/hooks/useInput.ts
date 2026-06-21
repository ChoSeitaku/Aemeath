// React hook for receiving keyboard input in Ink
import { useEffect, useCallback, useRef, useState } from 'react'
import { registerInputCallback, unregisterInputCallback, type InputEvent } from '../input.js'

export type UseInputHandler = (event: InputEvent) => void

/**
 * Hook to receive keyboard input events.
 * The callback is called on each keypress and the terminal re-renders.
 */
export function useInput(handler: UseInputHandler): void {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    registerInputCallback((event) => handlerRef.current(event))
    return () => unregisterInputCallback()
  }, [])
}

/**
 * Hook for text input with cursor management.
 * Returns the current input value and helpers.
 */
export function useTextInput(): {
  value: string
  cursorPos: number
  setValue: (v: string) => void
  handleEvent: (event: InputEvent) => void
  clear: () => void
} {
  const [value, setValue] = useState('')
  const cursorPosRef = useRef(0)
  const [cursorPos, setCursorPos] = useState(0)

  const handleEvent = useCallback((event: InputEvent) => {
    switch (event.type) {
      case 'char':
        setValue(prev => {
          const pos = cursorPosRef.current
          const next = prev.slice(0, pos) + event.char + prev.slice(pos)
          cursorPosRef.current = pos + 1
          setCursorPos(pos + 1)
          return next
        })
        break
      case 'backspace':
        setValue(prev => {
          const pos = cursorPosRef.current
          if (pos === 0) return prev
          const next = prev.slice(0, pos - 1) + prev.slice(pos)
          cursorPosRef.current = pos - 1
          setCursorPos(pos - 1)
          return next
        })
        break
      case 'delete':
        setValue(prev => {
          const pos = cursorPosRef.current
          if (pos >= prev.length) return prev
          return prev.slice(0, pos) + prev.slice(pos + 1)
        })
        break
      case 'left':
        setCursorPos(prev => {
          const next = Math.max(0, prev - 1)
          cursorPosRef.current = next
          return next
        })
        break
      case 'right':
        setCursorPos(prev => {
          const next = Math.min(value.length, prev + 1)
          cursorPosRef.current = next
          return next
        })
        break
      case 'home':
        cursorPosRef.current = 0
        setCursorPos(0)
        break
      case 'end':
        cursorPosRef.current = value.length
        setCursorPos(value.length)
        break
    }
  }, [value])

  const clear = useCallback(() => {
    setValue('')
    cursorPosRef.current = 0
    setCursorPos(0)
  }, [])

  return { value, cursorPos, setValue, handleEvent, clear }
}
