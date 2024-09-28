import { Container, ContainerOptions, DestroyOptions, Size } from 'pixi.js'
import { Yoga, YogaConfig } from './init.ts'
import {
  Align,
  Edge,
  Direction,
  FlexDirection,
  Wrap,
  Justify,
  Gutter,
  Overflow,
  PositionType,
  Display
} from 'yoga-layout/load'
import { FLEX_AFTER_LAYOUT, FormattedValue, FormattedValueWithAuto, formatValue } from './utils.ts'

export class FlexContainer extends Container {

  protected readonly node = Yoga!.Node.create(YogaConfig)

  // is the root of yoga tree?
  // means its parent is not FlexContainer
  isFlexRoot = true

  // is the leaf of yoga tree?
  // means all children is not FlexContainer
  // we expect children are either all FlexContainer, or all not FlexContainer
  isFlexLeaf = true

  // region parent-children relation

  private onAddedOrRemoved() {
    this.isFlexRoot = !(this.parent instanceof FlexContainer)
  }

  private onChildrenChange() {
    this.isFlexLeaf = this.children.every(child => !(child instanceof FlexContainer))
  }

  private onChildAdded(child: Container, _: Container, index: number) {
    checkMixedChildren(this.children, child, index)
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

  // endregion

  // region cache the w/h on Yoga node
  // if not set, the default Yoga node w/h is auto
  // if set, we can skip leaf node's measure process
  private _flexWidth: FormattedValueWithAuto
  private _flexHeight: FormattedValueWithAuto

  get flexWidth() { return this._flexWidth }
  set flexWidth(value: FormattedValueWithAuto) {
    this._flexWidth = value
    this.node.setWidth(value)
  }

  get flexHeight() { return this._flexHeight }
  set flexHeight(value: FormattedValueWithAuto) {
    this._flexHeight = value
    this.node.setHeight(value)
  }
  // endregion

  private leafSize: Size = { width: 0, height: 0 }

  // measure leaf width & height for layout
  protected onMeasureLeaf() {
    if (!this.isFlexLeaf) {
      for (const child of this.children) {
        (child as FlexContainer).onMeasureLeaf?.()
      }
      return
    }

    const widthDetermined = isSizeDetermined(this._flexWidth)
    const heightDetermined = isSizeDetermined(this._flexHeight)
    const skipMeasure = widthDetermined && heightDetermined
    if (!skipMeasure) {
      this.getSize(this.leafSize)
      const { width, height } = this.leafSize
      if (!widthDetermined) this.node.setWidth(width)
      if (!heightDetermined) this.node.setHeight(height)
    }
  }

  // apply calculated result from root to children
  // see https://www.yogalayout.dev/docs/advanced/incremental-layout
  protected applyLayout() {
    const node = this.node
    if (!node.hasNewLayout()) {
      return
    }

    // Reset the flag
    node.markLayoutSeen()

    // apply layout result to pixi
    const { left, top, width, height } = node.getComputedLayout()

    this.x = left
    this.y = top

    // layout children
    if (!this.isFlexLeaf) {
      for (const child of this.children) {
        (child as FlexContainer).applyLayout?.()
      }
    } else {
      // provide width & height info to children
      // console.log(this.label, `测量结果, left = ${left}, top = ${top}, right = ${right}, bottom = ${bottom}, width = ${width}, height = ${height}`)
      this.emit(FLEX_AFTER_LAYOUT, {
        // if skip measure, oldWidth & oldHeight is empty
        // oldWidth: this.leafSize.width,
        // oldHeight: this.leafSize.height,
        width,
        height
      })
    }
  }

  // on every render, we measure the entire tree and do layout
  private onRenderRoot() {
    if (!this.isFlexRoot) return

    // const measureStart = performance.now()
    this.onMeasureLeaf()
    // console.log('measure cost:', performance.now() - measureStart)

    // const layoutStart = performance.now()
    this.node.calculateLayout(undefined, undefined)
    // console.log('layout cost:', performance.now() - layoutStart)

    // const applyStart = performance.now()
    this.applyLayout()
    // console.log('apply cost:', performance.now() - applyStart)
  }

  // should do layout on every onRender？
  get doLayoutOnRender() {
    return this.onRender === this.onRenderRoot
  }

  set doLayoutOnRender(value: boolean) {
    // @ts-expect-error remove onRender callback
    this.onRender = (value ? this.onRenderRoot : null)
  }

  // exposed to outside for manually calling layout
  doLayout() {
    if (!this.isFlexRoot) {
      (this.parent as FlexContainer).doLayout()
      return
    }
    this.onRenderRoot()
  }

  // region handle visible <-> flex display
  override get visible() {
    return super.visible
  }

  override set visible(value: boolean) {
    super.visible = value
    this.node.setDisplay(value ? Display.Flex : Display.None)
  }
  // endregion

  // region add flex props
  get alignContent() {
    return this.node.getAlignContent()
  }

  set alignContent(value: Align) {
    this.node.setAlignContent(value)
  }

  get alignItems() {
    return this.node.getAlignItems()
  }

  set alignItems(value: Align) {
    this.node.setAlignItems(value)
  }

  get alignSelf() {
    return this.node.getAlignSelf()
  }

  set alignSelf(value: Align) {
    this.node.setAlignSelf(value)
  }

  get aspectRatio() {
    return this.node.getAspectRatio()
  }

  set aspectRatio(value: number | undefined) {
    this.node.setAspectRatio(value)
  }

  get borderTop() {
    return this.node.getBorder(Edge.Top)
  }

  set borderTop(value: number | undefined) {
    this.node.setBorder(Edge.Top, value)
  }

  get borderRight() {
    return this.node.getBorder(Edge.Right)
  }

  set borderRight(value: number | undefined) {
    this.node.setBorder(Edge.Right, value)
  }

  get borderBottom() {
    return this.node.getBorder(Edge.Bottom)
  }

  set borderBottom(value: number | undefined) {
    this.node.setBorder(Edge.Bottom, value)
  }

  get borderLeft() {
    return this.node.getBorder(Edge.Left)
  }

  set borderLeft(value: number | undefined) {
    this.node.setBorder(Edge.Left, value)
  }

  get borderStart() {
    return this.node.getBorder(Edge.Start)
  }

  set borderStart(value: number | undefined) {
    this.node.setBorder(Edge.Start, value)
  }

  get borderEnd() {
    return this.node.getBorder(Edge.End)
  }

  set borderEnd(value: number | undefined) {
    this.node.setBorder(Edge.End, value)
  }

  get borderHorizontal() {
    return this.node.getBorder(Edge.Horizontal)
  }

  set borderHorizontal(value: number | undefined) {
    this.node.setBorder(Edge.Horizontal, value)
  }

  get borderVertical() {
    return this.node.getBorder(Edge.Vertical)
  }

  set borderVertical(value: number | undefined) {
    this.node.setBorder(Edge.Vertical, value)
  }

  get border() {
    return this.node.getBorder(Edge.All)
  }

  set border(value: number | undefined) {
    this.node.setBorder(Edge.All, value)
  }

  get direction() {
    return this.node.getDirection()
  }

  set direction(value: Direction) {
    this.node.setDirection(value)
  }

  set flex(flex: number | undefined) {
    this.node.setFlex(flex)
  }

  get flexBasis() {
    return formatValue(this.node.getFlexBasis())
  }

  set flexBasis(flexBasis: FormattedValueWithAuto) {
    this.node.setFlexBasis(flexBasis)
  }

  get flexDirection() {
    return this.node.getFlexDirection()
  }

  set flexDirection(value: FlexDirection) {
    this.node.setFlexDirection(value)
  }

  get flexGrow() {
    return this.node.getFlexGrow()
  }

  set flexGrow(value: number | undefined) {
    this.node.setFlexGrow(value)
  }

  get flexShrink() {
    return this.node.getFlexShrink()
  }

  set flexShrink(value: number | undefined) {
    this.node.setFlexShrink(value)
  }

  get flexWrap() {
    return this.node.getFlexWrap()
  }

  set flexWrap(value: Wrap) {
    this.node.setFlexWrap(value)
  }

  get justifyContent() {
    return this.node.getJustifyContent()
  }

  set justifyContent(value: Justify) {
    this.node.setJustifyContent(value)
  }

  get gap() {
    return formatValue(this.node.getGap(Gutter.All)) as FormattedValue
  }

  set gap(value: FormattedValue) {
    this.node.setGap(Gutter.All, value)
  }

  get rowGap() {
    return formatValue(this.node.getGap(Gutter.Row)) as FormattedValue
  }

  set rowGap(value: FormattedValue) {
    this.node.setGap(Gutter.Row, value)
  }

  get columnGap() {
    return formatValue(this.node.getGap(Gutter.Column)) as FormattedValue
  }

  set columnGap(value: FormattedValue) {
    this.node.setGap(Gutter.Column, value)
  }

  get marginTop() {
    return formatValue(this.node.getMargin(Edge.Top))
  }

  set marginTop(value: FormattedValueWithAuto) {
    this.node.setMargin(Edge.Top, value)
  }

  get marginRight() {
    return formatValue(this.node.getMargin(Edge.Right))
  }

  set marginRight(value: FormattedValueWithAuto) {
    this.node.setMargin(Edge.Right, value)
  }

  get marginBottom() {
    return formatValue(this.node.getMargin(Edge.Bottom))
  }

  set marginBottom(value: FormattedValueWithAuto) {
    this.node.setMargin(Edge.Bottom, value)
  }

  get marginLeft() {
    return formatValue(this.node.getMargin(Edge.Left))
  }

  set marginLeft(value: FormattedValueWithAuto) {
    this.node.setMargin(Edge.Left, value)
  }

  get marginStart() {
    return formatValue(this.node.getMargin(Edge.Start))
  }

  set marginStart(value: FormattedValueWithAuto) {
    this.node.setMargin(Edge.Start, value)
  }

  get marginEnd() {
    return formatValue(this.node.getMargin(Edge.End))
  }

  set marginEnd(value: FormattedValueWithAuto) {
    this.node.setMargin(Edge.End, value)
  }

  get marginHorizontal() {
    return formatValue(this.node.getMargin(Edge.Horizontal))
  }

  set marginHorizontal(value: FormattedValueWithAuto) {
    this.node.setMargin(Edge.Horizontal, value)
  }

  get marginVertical() {
    return formatValue(this.node.getMargin(Edge.Vertical))
  }

  set marginVertical(value: FormattedValueWithAuto) {
    this.node.setMargin(Edge.Vertical, value)
  }

  get margin() {
    return formatValue(this.node.getMargin(Edge.All))
  }

  set margin(value: FormattedValueWithAuto) {
    this.node.setMargin(Edge.All, value)
  }

  get maxHeight() {
    return formatValue(this.node.getMaxHeight()) as FormattedValue
  }

  set maxHeight(value: FormattedValue) {
    this.node.setMaxHeight(value)
  }

  get maxWidth() {
    return formatValue(this.node.getMaxWidth()) as FormattedValue
  }

  set maxWidth(value: FormattedValue) {
    this.node.setMaxWidth(value)
  }

  get minHeight() {
    return formatValue(this.node.getMinHeight()) as FormattedValue
  }

  set minHeight(value: FormattedValue) {
    this.node.setMinHeight(value)
  }

  get minWidth() {
    return formatValue(this.node.getMinWidth()) as FormattedValue
  }

  set minWidth(value: FormattedValue) {
    this.node.setMinWidth(value)
  }

  get overflow() {
    return this.node.getOverflow()
  }

  set overflow(value: Overflow) {
    this.node.setOverflow(value)
  }

  get paddingTop() {
    return formatValue(this.node.getPadding(Edge.Top)) as FormattedValue
  }

  set paddingTop(value: FormattedValue) {
    this.node.setPadding(Edge.Top, value)
  }

  get paddingRight() {
    return formatValue(this.node.getPadding(Edge.Right)) as FormattedValue
  }

  set paddingRight(value: FormattedValue) {
    this.node.setPadding(Edge.Right, value)
  }

  get paddingBottom() {
    return formatValue(this.node.getPadding(Edge.Bottom)) as FormattedValue
  }

  set paddingBottom(value: FormattedValue) {
    this.node.setPadding(Edge.Bottom, value)
  }

  get paddingLeft() {
    return formatValue(this.node.getPadding(Edge.Left)) as FormattedValue
  }

  set paddingLeft(value: FormattedValue) {
    this.node.setPadding(Edge.Left, value)
  }

  get paddingStart() {
    return formatValue(this.node.getPadding(Edge.Start)) as FormattedValue
  }

  set paddingStart(value: FormattedValue) {
    this.node.setPadding(Edge.Start, value)
  }

  get paddingEnd() {
    return formatValue(this.node.getPadding(Edge.End)) as FormattedValue
  }

  set paddingEnd(value: FormattedValue) {
    this.node.setPadding(Edge.End, value)
  }

  get paddingHorizontal() {
    return formatValue(this.node.getPadding(Edge.Horizontal)) as FormattedValue
  }

  set paddingHorizontal(value: FormattedValue) {
    this.node.setPadding(Edge.Horizontal, value)
  }

  get paddingVertical() {
    return formatValue(this.node.getPadding(Edge.Vertical)) as FormattedValue
  }

  set paddingVertical(value: FormattedValue) {
    this.node.setPadding(Edge.Vertical, value)
  }

  get padding() {
    return formatValue(this.node.getPadding(Edge.All)) as FormattedValue
  }

  set padding(value: FormattedValue) {
    this.node.setPadding(Edge.All, value)
  }

  get top() {
    return formatValue(this.node.getPosition(Edge.Top)) as FormattedValue
  }

  set top(value: FormattedValue) {
    this.node.setPosition(Edge.Top, value)
  }

  get right() {
    return formatValue(this.node.getPosition(Edge.Right)) as FormattedValue
  }

  set right(value: FormattedValue) {
    this.node.setPosition(Edge.Right, value)
  }

  get bottom() {
    return formatValue(this.node.getPosition(Edge.Bottom)) as FormattedValue
  }

  set bottom(value: FormattedValue) {
    this.node.setPosition(Edge.Bottom, value)
  }

  get left() {
    return formatValue(this.node.getPosition(Edge.Left)) as FormattedValue
  }

  set left(value: FormattedValue) {
    this.node.setPosition(Edge.Left, value)
  }

  get start() {
    return formatValue(this.node.getPosition(Edge.Start)) as FormattedValue
  }

  set start(value: FormattedValue) {
    this.node.setPosition(Edge.Start, value)
  }

  get end() {
    return formatValue(this.node.getPosition(Edge.End)) as FormattedValue
  }

  set end(value: FormattedValue) {
    this.node.setPosition(Edge.End, value)
  }

  get positionType() {
    return this.node.getPositionType()
  }

  set positionType(value: PositionType) {
    this.node.setPositionType(value)
  }
  // endregion
}

function isSizeDetermined(value: FormattedValueWithAuto) {
  return typeof value !== 'undefined' && value !== 'auto'
}

function checkMixedChildren(children: Container[], newChild: Container, newChildIndex: number) {
  if (children.length <= 1) return // newChild is the only child
  const whateverAnotherChild = children[newChildIndex === 0 ? 1 : 0]
  const isAllFlexChildren = whateverAnotherChild instanceof FlexContainer
  const isNewFlexChildren = newChild instanceof FlexContainer
  if (isAllFlexChildren !== isNewFlexChildren) {
    console.warn('mixed children type is not recommended')
  }
}
