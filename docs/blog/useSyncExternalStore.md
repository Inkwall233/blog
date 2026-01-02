---
date: 2025-12-13
tags: 
  - 技术
  - React
categories:
  - 学习总结
---
# React Hooks useSyncExternalStore

 `useSyncExternalStore` 是 React 18 引入的一个 Hook，用于在函数组件中同步外部存储（如 Redux store、Context API 等）的数据。这个 Hook 的主要目的是解决在 React 组件中使用外部存储时可能出现的性能问题和一致性问题。

## 场景
1、订阅外部store例如（redux，Zustand）等。
2、订阅浏览器API，例如（storage，geolocation）等。
3、抽离逻辑到外部，例如（useLocalStorage，useGeolocation）等。
4、服务端渲染支持

用法
```js
const res = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot )
```
+ subscribe: 订阅外部store的更新，接受一个回调函数，在数据源更新时调用。
+ getSnapshot: 获取当前数据源的快照（当前状态）
+ getServerSnapshot?: 服务端渲染时获取数据源的快照

## 案例
### 1. 订阅浏览器Api实现自定义hook（useLocalStorage）

封装成hooks
```ts
import { useSyncExternalStore } from 'react'

export const useStorageHook = (key: string, defaultValue?: any) => {
  const subscribe = (callback: () => void) => {
    const handler = (e: StorageEvent) => {
      // 只有当事件涉及我们关心的键时才调用回调
      if (e.key === key || e.key === null) {
        console.log('storage change', e)
        callback()
      }
    }

    window.addEventListener('storage', handler)

    // 订阅者返回一个函数，用于取消注销
    return () => {
      window.removeEventListener('storage', handler)
    }
  }

  const setStorage = (value: any) => {
    try {
      const stringValue = JSON.stringify(value)
      const oldValue = localStorage.getItem(key)
      localStorage.setItem(key, stringValue)
      // 需要手动触发storage事件，因为setItem不会触发同一页面的storage事件
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          oldValue,
          newValue: stringValue,
        })
      )
    } catch (error) {
      console.error('Failed to set item to localStorage:', error)
    }
  }

  const getSnapshot = () => {
    const item = localStorage.getItem(key)
    if (item) {
      try {
        return JSON.parse(item)
      } catch {
        return item
      }
    }
    return defaultValue
  }

  const res = useSyncExternalStore(subscribe, getSnapshot)
  return [res, setStorage] as const // as const 表示返回的是元组
}
```
使用
```jsx
import { useStorageHook } from '../../hooks/useStorage'
export default function UseSyncExternalStore() {
  const [value, setValue] = useStorageHook('count', '0')
  return (
    <>
      <h1>useSyncExternalStore 学习</h1>
      <span>{value}</span>
      <button
        onClick={() =>
          setValue(Number(value) + 1)
        }
      >
        增加
      </button>
    </>
  )
}
```

**效果**

1、跨标签同步：浏览器打开两个页面，点击页面1的按钮，页面2的数字也会增加

### 2.订阅history实现路由跳转
```ts
import { useSyncExternalStore } from 'react'
export const useHistoryHook = () => {
	const subscribe = (callback: () => void) => {
		window.addEventListener('popstate', callback)

		return () => {
			window.removeEventListener('popstate', callback)
		}
	}

	const getSnapshot = () => {
		return window.location.href
	}

	const push = (path: string) => {
		window.history.pushState(null, '', path)
		window.dispatchEvent(new PopStateEvent('popstate'))
	}

	const replace = (path: string) => {
		window.history.replaceState(null, '', path)
		window.dispatchEvent(new PopStateEvent('popstate'))
	}
	const res = useSyncExternalStore(subscribe, getSnapshot)
	return [res, push, replace] as const
}
```
使用
```tsx

import { RouterProvider } from 'react-router'
import { router } from './router/index.ts'
import { useHistoryHook } from "./hooks/useHistory.ts";
function App() {
  const [path, push, replace] = useHistoryHook()
  return (
    <>
    <span>{path}</span>
    <button onClick={() => push('/home')}>push</button>
    <button onClick={() => replace('/about')}>replace</button>
    <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App

```

## 注意事项
如果`getSnapshot`返回值不同于上一次，Recat会重新渲染组件。
如果每次都返回一个对象时，会触发重新渲染，导致会陷入无限循环。
所有如果返回的是一个对象时，需要对对象进行比较，如果比较结果相同，则返回上一次的对象，而不是新对象
将上面的订阅history路由跳转，改为返回对象，如下所示
```ts
import { useSyncExternalStore } from 'react'
export const useHistoryHook = () => {
	const subscribe = (callback: () => void) => {
		window.addEventListener('popstate', callback)

		return () => {
			window.removeEventListener('popstate', callback)
		}
	}
	let temp: Location | null = null
	const getSnapshot = () => {
		if (!temp || temp.href !== window.location.href) {
			// 更改为返回新对象
			temp = { ...window.location }
		}
		return temp
	}

	const push = (path: string) => {
		window.history.pushState(null, '', path)
		window.dispatchEvent(new PopStateEvent('popstate'))
	}

	const replace = (path: string) => {
		window.history.replaceState(null, '', path)
		window.dispatchEvent(new PopStateEvent('popstate'))
	}
	const res = useSyncExternalStore(subscribe, getSnapshot)
	return [res, push, replace] as const
}
```


## 参考
1. [useSyncExternalStore 官方文档](https://zh-hans.reactjs.org/docs/hooks-reference.html#usesyncexternalsource)
2. [React19+Hooks+TS+zustand+源码 视频教程](https://www.bilibili.com/video/BV1mcpPeMETt)
