declare module 'react-reconciler' {
  import { ReactNode } from 'react'

  interface HostConfig {
    supportsMutation: boolean
    createInstance(type: string, props: any): any
    createTextInstance(text: string): any
    appendInitialChild(parent: any, child: any): void
    finalizeInitialChildren(instance: any, type: string, props: any): boolean
    prepareUpdate(instance: any, type: string, oldProps: any, newProps: any): any
    shouldSetTextContent(type: string, props: any): boolean
    getRootHostContext(): any
    getChildHostContext(): any
    getPublicInstance(instance: any): any
    prepareForCommit(): void
    resetAfterCommit(): void
    scheduleTimeout(): void
    cancelTimeout(): void
    noTimeout: boolean
    isPrimaryRenderer: boolean
    supportsMicrotask: boolean
    scheduleMicrotask(): void
    supportsPersistence: boolean
    cloneInstance(): any
    createContainerChildSet(): any
    appendChildToContainerChildSet(): void
    finalizeContainerChildren(): void
    replaceContainerChildren(): void
    getInstanceFromNode(): any
    preparePortalMount(): void
    schedulePassiveEffects(): void
    cancelPassiveEffects(): void
  }

  interface Reconciler {
    createContainer(
      containerInfo: any,
      isStrictMode: boolean,
      concurrentUpdatesByDefaultOverride: boolean
    ): any
    updateContainer(
      element: ReactNode,
      container: any,
      parentComponent: any,
      callback: () => void
    ): any
    getPublicRootInstance(container: any): any
    batchedUpdates(fn: () => void): void
    flushSync(): void
  }

  function ReactReconciler(config: HostConfig): Reconciler

  export default ReactReconciler
}
