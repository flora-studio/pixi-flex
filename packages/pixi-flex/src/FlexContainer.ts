import { Container, ContainerOptions, DestroyOptions } from 'pixi.js'
import Yoga from 'yoga-layout'

export class FlexContainer extends Container {

  readonly node = Yoga.Node.create()

  isFlexRoot = true
  isFlexLeaf = true

  private onAddedOrRemoved() {
    this.isFlexRoot = !(this.parent instanceof FlexContainer)
  }

  private onChildrenChange() {
    this.isFlexLeaf = this.children.every(child => !(child instanceof FlexContainer))
  }

  private onChildAdded(child: Container, _: Container, index: number) {
    // todo check mixed children
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
  // which mutates `children` without event
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
}
