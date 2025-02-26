interface ArrayListeners<T> {
  onInsert?(index: number, value: T): void
  onDelete?(index: number, oldValue: T): void
  onChanged?(): void
}

export function createArrayProxy<T>(initialArray: T[], listeners?: ArrayListeners<T>) {
  const { onInsert, onDelete, onChanged } = listeners ?? {}
  const handler: ProxyHandler<T[]> = {
    get(target, prop, receiver) {
      const originalMethod = Reflect.get(target, prop, receiver)

      // 记录是否发生 children 改变
      let hasChildrenChange = false

      // 拦截修改数组的方法
      if (typeof originalMethod === 'function') {
        return function (this: T[], ...args: any[]) {
          // 记录操作前状态
          switch (prop) {
            case 'push': {
              if (args.length > 0) {
                for (let i = 0; i < args.length; i++) {
                  onInsert?.(target.length + i, args[i])
                }
                hasChildrenChange = true
              }
              break
            }
            case 'pop': {
              if (target.length > 0) {
                onDelete?.(target.length - 1, target[target.length - 1])
                hasChildrenChange = true
              }
              break
            }
            case 'splice': {
              const [start, deleteCount, ...items] = args
              // 记录删除
              if (deleteCount > 0) {
                const deleted = target.slice(start, start + deleteCount)
                for (let i = 0; i < deleted.length; i++) {
                  onDelete?.(start + i, deleted[i])
                }
              }
              // 记录插入
              for (let i = 0; i < items.length; i++) {
                onInsert?.(start + i, items[i])
              }
              hasChildrenChange = true
              break
            }
            case 'shift': {
              if (target.length > 0) {
                onDelete?.(0, target[0])
                hasChildrenChange = true
              }
              break
            }
            case 'unshift':
              if (args.length > 0) {
                for (let i = args.length - 1; i >= 0; i--) {
                  onInsert?.(0, args[i])
                }
                hasChildrenChange = true
              }
              break
          }

          const result = originalMethod.apply(this, args)
          // children 发生变化回调
          if (hasChildrenChange && onChanged) {
            onChanged()
          }

          return result
        }
      }

      return originalMethod
    },
    // set 操作用来拦截 arr[1] = 2 这样的情况
    // 此处暂不处理，因为 push 等方法底层也会调用 set，导致触发多次
    // 并且即使处理了，因为情况很多，也很难 diff 出真正的操作
    // pixijs 中直接操作下标的操作目前只发现 `swapChildren` 和 `removeChildren` 两种
    // 都通过继承单独处理了
    //
    // set(target, prop, value) {
    //   const numericProp = Number(prop);
    //
    //   // 处理直接索引赋值
    //   if (!isNaN(numericProp)) {
    //     if (numericProp >= target.length) {
    //       // 插入新元素
    //       console.log({
    //         type: 'insert',
    //         index: numericProp,
    //         value
    //       });
    //     } else {
    //       // 修改现有元素（不记录）
    //     }
    //   }
    //
    //   return Reflect.set(target, prop, value);
    // }
  };

  return new Proxy(initialArray, handler)
}
