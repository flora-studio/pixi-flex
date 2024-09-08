import { Container, ContainerOptions, DestroyOptions, Size } from 'pixi.js'
import Yoga from 'yoga-layout'

export class FlexContainer extends Container {

  readonly node = Yoga.Node.create()

  // is the root of yoga tree?
  // means its parent is not FlexContainer
  isFlexRoot = true

  // is the leaf of yoga tree?
  // means all children is not FlexContainer
  // we expect children are either all FlexContainer, or all not FlexContainer
  isFlexLeaf = true

  private onAddedOrRemoved() {
    this.isFlexRoot = !(this.parent instanceof FlexContainer)
  }

  private onChildrenChange() {
    this.isFlexLeaf = this.children.every(child => !(child instanceof FlexContainer))
  }

  private onChildAdded(child: Container, _: Container, index: number) {
    checkMixedChildren(this.children, child)
    if (child instanceof FlexContainer) {
      this.node.insertChild(child.node, index)
    }
  }

  private onChildRemoved(child: Container) {
    if (child instanceof FlexContainer) {
      this.node.removeChild(child.node)
    }
  }

  constructor(options?: ContainerOptions) {
    super(options)
    this.onAddedOrRemoved = this.onAddedOrRemoved.bind(this)
    this.onChildrenChange = this.onChildrenChange.bind(this)
    this.onChildAdded = this.onChildAdded.bind(this)
    this.onChildRemoved = this.onChildRemoved.bind(this)
    this.onRenderRoot = this.onRenderRoot.bind(this)
    this.initListeners()
  }

  // there are many methods that change the parent-child relation
  // so we use events to sync the relationship to yoga nodes
  private initListeners() {
    this.on('added', this.onAddedOrRemoved)
    this.on('removed', this.onAddedOrRemoved)
    this.on('childAdded', this.onChildrenChange)
    this.on('childRemoved', this.onChildrenChange)
    this.on('childAdded', this.onChildAdded)
    this.on('childRemoved', this.onChildRemoved)
    this.onRender = this.onRenderRoot
  }

  private removeListeners() {
    this.off('added', this.onAddedOrRemoved)
    this.off('removed', this.onAddedOrRemoved)
    this.off('childAdded', this.onChildrenChange)
    this.off('childRemoved', this.onChildrenChange)
    this.off('childAdded', this.onChildAdded)
    this.off('childRemoved', this.onChildRemoved)
  }

  // it seems the only exception is `swapChildren`
  // which mutates `children` without event emitted
  override swapChildren(child1: Container, child2: Container) {
    super.swapChildren(child2, child2)
    if (child1 === child2) return
    if (!(child1 instanceof FlexContainer) || !(child2 instanceof FlexContainer)) return
    const index1 = this.getChildIndex(child1)
    const index2 = this.getChildIndex(child2)
    this.node.removeChild(child1.node)
    this.node.removeChild(child2.node)
    this.node.insertChild(child1.node, index2 - 1)
    this.node.insertChild(child2.node, index1)
  }

  override destroy(options?: DestroyOptions) {
    this.removeListeners()
    this.node.free()
    super.destroy(options)
  }

  // on every render, we measure the entire tree and do layout
  private onRenderRoot() {
    if (!this.isFlexRoot) return

    const measureStart = performance.now()
    this.onMeasureLeaf()
    console.log('measure cost:', performance.now() - measureStart)

    const layoutStart = performance.now()
    this.node.calculateLayout(undefined, undefined)
    console.log('layout cost:', performance.now() - layoutStart)

    const applyStart = performance.now()
    this.applyLayout()
    console.log('apply cost:', performance.now() - applyStart)
  }

  // skip measure for leaf node, so you can set a fixed size for yoga to layout
  skipMeasure = false

  private leafSize: Size = { width: 0, height: 0 }

  // measure leaf width & height for layout
  protected onMeasureLeaf() {
    if (!this.isFlexLeaf) {
      for (const child of this.children) {
        (child as FlexContainer).onMeasureLeaf?.()
      }
      return
    }
    if (!this.skipMeasure) {
      this.getSize(this.leafSize)
      const { width, height } = this.leafSize
      this.node.setWidth(width)
      this.node.setHeight(height)
    }
  }

  // apply calculated result from root to children
  // see https://www.yogalayout.dev/docs/advanced/incremental-layout
  protected applyLayout(parentX = 0, parentY = 0) {
    const node = this.node
    if (!node.hasNewLayout()) {
      return
    }

    // Reset the flag
    node.markLayoutSeen()

    // apply layout result to pixi
    const { left, top, width, height } = node.getComputedLayout()
    this.x = left - parentX
    this.y = top - parentY

    // layout children
    if (!this.isFlexLeaf) {
      for (const child of this.children) {
        (child as FlexContainer).applyLayout?.(left, top)
      }
    } else {
      // provide width & height info to children
      for (const child of this.children) {
        child.emit('flex-after-layout', width, height)
      }
    }
  }
}

function checkMixedChildren(children: Container[], newChild: Container) {
  if (children.length === 0) return
  const isAllFlexChildren = children[0] instanceof FlexContainer
  const isNewFlexChildren = newChild instanceof FlexContainer
  if (isAllFlexChildren !== isNewFlexChildren) {
    console.warn('mixed children type is not recommended')
  }
}
