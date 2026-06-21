// Minimal React reconciler for terminal UI
// Based on Claude Code's approach but simplified for Aemeath

import ReactReconciler from 'react-reconciler'
import type { LayoutNode } from './layout/node.js'
import { LayoutEdge } from './layout/node.js'
import { createLayoutNode } from './layout/engine.js'

// Use legacy mode instead of concurrent mode for better Bun compatibility
const LegacyRoot = 0

// Node types
type TextInstance = {
  tag: 'TEXT'
  text: string
  parent: ContainerInstance | BoxInstance | null
}

type BoxInstance = {
  tag: 'BOX'
  props: Record<string, any>
  children: (BoxInstance | TextInstance)[]
  parent: ContainerInstance | BoxInstance | null
  layoutNode: LayoutNode
  width: number
  height: number
}

type ContainerInstance = {
  tag: 'CONTAINER'
  children: (BoxInstance | TextInstance)[]
  layoutNode: LayoutNode
  width: number
  height: number
}

type Instance = ContainerInstance | BoxInstance | TextInstance

// Host config
const hostConfig = {
  supportsMutation: true,
  supportsMicrotask: true,
  isPrimaryRenderer: true,

  // Create instance
  createInstance(type: string, props: Record<string, any>): BoxInstance {
    const layoutNode = createLayoutNode()

    // Apply styles from props
    if (props.width) layoutNode.setWidth(props.width)
    if (props.height) layoutNode.setHeight(props.height)
    if (props.flexDirection) layoutNode.setFlexDirection(props.flexDirection)
    if (props.justifyContent) layoutNode.setJustifyContent(props.justifyContent)
    if (props.alignItems) layoutNode.setAlignItems(props.alignItems)
    if (props.padding) layoutNode.setPadding(LayoutEdge.All, props.padding)
    if (props.margin) layoutNode.setMargin(LayoutEdge.All, props.margin)
    if (props.marginTop) layoutNode.setMargin(LayoutEdge.Top, props.marginTop)
    if (props.marginBottom) layoutNode.setMargin(LayoutEdge.Bottom, props.marginBottom)
    if (props.paddingTop) layoutNode.setPadding(LayoutEdge.Top, props.paddingTop)
    if (props.paddingBottom) layoutNode.setPadding(LayoutEdge.Bottom, props.paddingBottom)

    return {
      tag: 'BOX',
      props,
      children: [],
      parent: null,
      layoutNode,
      width: 0,
      height: 0,
    }
  },

  createTextInstance(text: string): TextInstance {
    return {
      tag: 'TEXT',
      text,
      parent: null,
    }
  },

  // Append child
  appendChild(parent: Instance, child: Instance): void {
    if (parent.tag === 'TEXT') return

    const parentBox = parent as BoxInstance | ContainerInstance
    parentBox.children.push(child as BoxInstance | TextInstance)

    if (child.tag === 'BOX') {
      const childBox = child as BoxInstance
      childBox.parent = parentBox
      parentBox.layoutNode.insertChild(
        childBox.layoutNode,
        parentBox.children.length - 1,
      )
    }
  },

  // Insert before
  insertBefore(
    parent: Instance,
    child: Instance,
    beforeChild: Instance,
  ): void {
    if (parent.tag === 'TEXT') return

    const parentBox = parent as BoxInstance | ContainerInstance
    const index = parentBox.children.indexOf(beforeChild as any)
    if (index !== -1) {
      parentBox.children.splice(index, 0, child as BoxInstance | TextInstance)
      if (child.tag === 'BOX') {
        const childBox = child as BoxInstance
        childBox.parent = parentBox
        parentBox.layoutNode.insertChild(childBox.layoutNode, index)
      }
    }
  },

  // Remove child
  removeChild(parent: Instance, child: Instance): void {
    if (parent.tag === 'TEXT') return

    const parentBox = parent as BoxInstance | ContainerInstance
    const index = parentBox.children.indexOf(child as any)
    if (index !== -1) {
      parentBox.children.splice(index, 1)
      if (child.tag === 'BOX') {
        const childBox = child as BoxInstance
        parentBox.layoutNode.removeChild(childBox.layoutNode)
      }
    }
  },

  // Commit update
  commitUpdate(
    instance: Instance,
    updatePayload: any,
    type: string,
    oldProps: Record<string, any>,
    newProps: Record<string, any>,
  ): void {
    if (instance.tag !== 'BOX') return

    const box = instance as BoxInstance
    box.props = newProps

    // Reapply styles
    const node = box.layoutNode
    if (newProps.width !== oldProps.width) {
      if (newProps.width) node.setWidth(newProps.width)
    }
    if (newProps.height !== oldProps.height) {
      if (newProps.height) node.setHeight(newProps.height)
    }
  },

  // Commit text update
  commitTextUpdate(
    instance: Instance,
    oldText: string,
    newText: string,
  ): void {
    if (instance.tag === 'TEXT') {
      ;(instance as TextInstance).text = newText
    }
  },

  // Get root container
  getRootHostContext(): any {
    return null
  },

  // Get parent host context
  getChildHostContext(): any {
    return null
  },

  // Should set text content
  shouldSetTextContent(): boolean {
    return false
  },

  // Finalize initial children
  finalizeInitialChildren(): boolean {
    return false
  },

  // Prepare update
  prepareUpdate(): any {
    return null
  },

  // Prepare for commit
  prepareForCommit(): any {
    return null
  },

  // Reset after commit
  resetAfterCommit(container: ContainerInstance): void {
    // Trigger re-render
    container.layoutNode.calculateLayout(container.width, container.height)
  },

  // Clear container
  clearContainer(container: ContainerInstance): void {
    container.children = []
  },

  // Append initial child (required by react-reconciler)
  appendInitialChild(parent: Instance, child: Instance): void {
    if (parent.tag === 'TEXT') return

    const parentBox = parent as BoxInstance | ContainerInstance
    parentBox.children.push(child as BoxInstance | TextInstance)

    if (child.tag === 'BOX') {
      const childBox = child as BoxInstance
      childBox.parent = parentBox
      parentBox.layoutNode.insertChild(
        childBox.layoutNode,
        parentBox.children.length - 1,
      )
    }
  },

  // Append child to container
  appendChildToContainer(container: ContainerInstance, child: Instance): void {
    if (container.tag === 'CONTAINER') {
      container.children.push(child as BoxInstance | TextInstance)
      if (child.tag === 'BOX') {
        const childBox = child as BoxInstance
        childBox.parent = container
        container.layoutNode.insertChild(
          childBox.layoutNode,
          container.children.length - 1,
        )
      }
    }
  },

  // Insert before in container
  insertInContainerBefore(
    container: ContainerInstance,
    child: Instance,
    beforeChild: Instance,
  ): void {
    if (container.tag === 'CONTAINER') {
      const index = container.children.indexOf(beforeChild as any)
      if (index !== -1) {
        container.children.splice(index, 0, child as BoxInstance | TextInstance)
        if (child.tag === 'BOX') {
          const childBox = child as BoxInstance
          childBox.parent = container
          container.layoutNode.insertChild(childBox.layoutNode, index)
        }
      }
    }
  },

  // Hide instance
  hideInstance(instance: Instance): void {
    if (instance.tag === 'BOX') {
      ;(instance as BoxInstance).layoutNode.setDisplay('none')
    }
  },

  // Unhide instance
  unhideInstance(instance: Instance): void {
    if (instance.tag === 'BOX') {
      ;(instance as BoxInstance).layoutNode.setDisplay('flex')
    }
  },

  // Remove child from container
  removeChildFromContainer(container: ContainerInstance, child: Instance): void {
    if (container.tag === 'CONTAINER') {
      const index = container.children.indexOf(child as any)
      if (index !== -1) {
        container.children.splice(index, 1)
        if (child.tag === 'BOX') {
          const childBox = child as BoxInstance
          container.layoutNode.removeChild(childBox.layoutNode)
        }
      }
    }
  },

  // Detach deleted instance (required by react-reconciler)
  detachDeletedInstance(instance: Instance): void {
    // No-op for now
  },

  // Schedule microtask
  scheduleMicrotask(callback: () => void): void {
    queueMicrotask(callback)
  },
}

// Create reconciler
const reconciler = ReactReconciler(hostConfig as any)

// Container
export type TerminalContainer = {
  root: any
  layoutNode: LayoutNode
  width: number
  height: number
}

// Create container
export function createContainer(
  width: number = 80,
  height: number = 24,
): TerminalContainer {
  const layoutNode = createLayoutNode()
  const root = reconciler.createContainer(
    { tag: 'CONTAINER', children: [], layoutNode, width, height },
    false,
    false,
  )

  return { root, layoutNode, width, height }
}

// Update container
export function updateContainer(
  container: TerminalContainer,
  element: React.ReactNode,
): Promise<void> {
  return new Promise((resolve) => {
    reconciler.updateContainer(element, container.root, null, () => {
      resolve()
    })
  })
}

// Render container to string
export function renderToString(container: TerminalContainer): string {
  const lines: string[] = []
  const layoutNode = container.layoutNode

  // Calculate layout
  layoutNode.calculateLayout(container.width, container.height)

  // Walk the tree and collect text
  function walk(node: BoxInstance | ContainerInstance, x: number, y: number) {
    const computedX = x + node.layoutNode.getComputedLeft()
    const computedY = y + node.layoutNode.getComputedTop()

    for (const child of node.children) {
      if (child.tag === 'TEXT') {
        // Simple text rendering
        const text = (child as TextInstance).text
        while (lines.length <= computedY + lines.length) {
          lines.push('')
        }
        const lineIndex = computedY + lines.length - 1
        if (lineIndex >= 0 && lineIndex < lines.length) {
          lines[lineIndex] = (lines[lineIndex] || '').padEnd(computedX) + text
        }
      } else if (child.tag === 'BOX') {
        walk(child as BoxInstance, computedX, computedY)
      }
    }
  }

  // Get the root container instance
  const rootContainer = container.root.containerInfo as ContainerInstance
  walk(rootContainer, 0, 0)

  return lines.join('\n')
}
