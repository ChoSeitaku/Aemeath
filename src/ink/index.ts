// Ink Bun compatibility layer
// Provides React-based terminal UI that works with Bun

// Layout engine
export { createLayoutNode } from './layout/engine.js'
export { YogaLayoutNode } from './layout/yoga.js'
export type { LayoutNode, LayoutEdge, LayoutAlign, LayoutJustify } from './layout/node.js'

// React reconciler
export { createContainer, updateContainer, renderToString } from './reconciler.js'
export type { TerminalContainer } from './reconciler.js'

// Components
export { Box } from './components/Box.js'
export { Text } from './components/Text.js'

// Render function
export { render } from './render.js'

// Input system
export { useInput, useTextInput } from './hooks/useInput.js'
export type { InputEvent } from './input.js'
export { registerInputCallback, unregisterInputCallback, dispatchInputEvent } from './input.js'

// Stdin handler
export { StdinHandler, createStdinHandler } from './stdin.js'
export type { Key } from './stdin.js'
