---
date: 2026-01-02
tags: 
  - 技术
  - React
categories:
  - 学习总结
---
# React Hooks useEffect

 `useEffect` 是 React 18 引入的一个 Hook，用于在函数组件中执行副作用操作。副作用操作包括订阅外部数据源、操作 DOM、调用异步函数等。这个 Hook 的主要目的是将组件中的副作用逻辑从渲染逻辑中分离出来，使代码更加清晰和可维护。

## 副作用函数和纯函数
### 纯函数
纯函数是指对于相同的输入，总是返回相同的输出，并且不依赖于外部状态。
```js
const pureFunction = (a, b) => a + b;
```

### 副作用函数
1. 副作用函数是指那些在执行时会修改外部状态或依赖外部可变状态的函数。
2. 副作用函数的副作用可能包括：
  - 改变 DOM 节点的属性或样式
  - 操作引用类型
  - 调用异步函数，例如获取数据、发送请求等
  - 操作本地存储例如localStorage、sessionStorage等
  - 计时器

## useEffect 用法
```js
useEffect(setup, dependencies)
```
### 参数
+ setup: Effect 处理函数，可以返回一个清理函数。组件卸载时执行setup返回的清理函数。依赖项改变时，先执行清理函数，再执行setup函数，组件卸载时再执行setup函数。
+ dependencies: 依赖数组，用于指定 Effect 处理函数的依赖项。当依赖项发生变化时，Effect 处理函数会重新执行。如果省略依赖数组，Effect 处理函数会在每次渲染时都执行。
### 示例
```js
const a = useEffect(() => {})

```

## 基本使用
### 操作DOM
```js
import { useEffect } from "react"
export default function UseEffect() {
  const dom = document.getElementById('useEffect-page')
  console.log('dom', dom)

  useEffect(() => {
    // 这里获取到的 dom 一定存在，因为 useEffect 在组件渲染后执行
    const dom = document.getElementById('useEffect-page')
    console.log('dom-in-effect', dom)
  })
  return <div id="useEffect-page">UseEffect Page</div>
}
```
## 执行时机
### 组件挂载时执行
组件挂载时，useEffect 会在组件渲染完成之后执行。类似于 componentDidMount 生命周期方法。

### 组件更新时执行
+ 无依赖项更新
```js
export default function UseEffect() {
  const dom = document.getElementById('useEffect-page')
  console.log('dom', dom)

  const [count, setCount] = useState(0)

  useEffect(() => {
    // 这里获取到的 dom 一定存在，因为 useEffect 在组件渲染后执行
    const dom = document.getElementById('useEffect-page')
    console.log('dom-in-effect', dom)
  })
  return <div id="useEffect-page">UseEffect Page
    <div>count: {count}</div>
    <button onClick={() => setCount(count + 1)}>+1</button>
  </div>
}
```

+ 有依赖项更新
当依赖项数组中的`count`改变时，useEffect 会重新执行。
```js
export default function UseEffect() {
	// const dom = document.getElementById('useEffect-page')
	// console.log('dom', dom)

	const [count, setCount] = useState(0)
    const [input, setInput] = useState('')

	useEffect(() => {
		// 这里获取到的 dom 一定存在，因为 useEffect 在组件渲染后执行
		const dom = document.getElementById('useEffect-page')
		console.log('dom-in-effect', dom)
	}, [count])
	return (
		<div id='useEffect-page'>
			UseEffect Page
			<div>count: {count}</div>
			<button onClick={() => setCount(count + 1)}>+1</button>

      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
		</div>
	)
}
```

+ 依赖项空值
当依赖项为空数组时，useEffect 的副作用函数只执行一次，即组件挂载时。
```js
	useEffect(() => {
		const dom = document.getElementById('useEffect-page')
		console.log('dom-in-effect', dom)
	}, [])
```

### 组件卸载时执行
useEffect的副作用函数，可以返回一个清理函数，当组件卸载时，useEffect的副作用函数就会执行清理函数
```ts
	// 子组件
	const Child = (props: { name: string }) => {
		useEffect(() => {
			console.log('子组件渲染', props.name)
			return () => {
				console.log('子组件销毁', props.name)
			}
		})

		return (
			<div>
				<div>input: {props.name}</div>
			</div>
		)
	}
	return (
		<div id='useEffect-page'>
			UseEffect Page
			<div>count: {count}</div>
			<button onClick={() => setCount(count + 1)}>+1</button>
			<input
				type='text'
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<button onClick={() => setVisible(!visible)}>
				{visible ? '隐藏' : '显示'}
			</button>
			{visible && <Child name={input} />}
		</div>
	)
```
### 清理函数的应用场景
清理函数主要用于清理副作用，防止内存泄漏或不必要的操作。常见的应用场景包括：
+ 取消订阅外部事件，例如取消订阅浏览器API、取消订阅Redux store等。
+ 取消异步操作，例如取消发送请求、取消定时器等。
+ 释放资源，例如关闭文件句柄、释放数据库连接等。
```ts
		useEffect(() => {
			console.log('子组件渲染', props.name)
      const timer = setTimeout(() => {
        console.log('子组件定时器', props.name)
      }, 3000)
			return () => {
				console.log('子组件销毁', props.name)
        clearTimeout(timer)
			}
		})
```