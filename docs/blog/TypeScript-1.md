---
date: 2026-01-03
tags:
  - 技术
  - TypeScript
categories:
  - 学习总结
---

# 快速了解 TypeScript

TypeScript 是一种开源编程语言，它是 JavaScript 的超集，添加了可选的静态类型和基于类的面向编程特性。
主要特点

- JavaScript 的超集：任何有效的 js 代码也是有效的 ts 代码
- 静态类型检查：在编译时检测类型错误，而非运行时
- 编译时：浏览器和 nodejs 并不能直接识别 TS 代码，需要被编译成 js 代码。在编译到 js 之前，进行类型检查

## 好用的 vscode 插件

- Error Lens

## TypeScript 的安装

``` bash
// 安装 typescript
npm install -g typescript

// 初始化 tsconfig.json
tsc --init

// 编译
tsc .\index.ts

```

**ts-node:** 将ts代码在内存中完成编译，同时完成运行
``` bash
npm i ts-node -g

ts-node .\index.ts
```

## 常见类型

### JS 数据类型

**基本类型**

- number
- string
- boolean
- null
- undefined
- symbol
- bigint

**引用类型**

- object

  - 普通对象

  - function

  - array

  - 内置对象
    - Date
    - 集合
      - weakMap
      - Map
      - Set
      - weakSet

### TS 新增数据类型

- any
- unknown
- never
- void
- 字面量类型
  字面量类型是指一个具体的值，比如字符串字面量类型 "hello"，数字字面量类型 42，布尔字面量类型 true 和 false。
- tuple
  元组：数组，每个元素都有自己的类型
- enum
  枚举：一组有名字的常量集合
- Union Types
  联合类型：多个类型组合的类型，一个值可以是多个类型中的任意一个
- Intersection Types
  交叉类型：多个类型组合的类型，一个值必须是多个类型中的所有类型
- interface
- Type Aliases
  类型别名：为类型起一个新的名字
- Gererics
  泛型：定义一个函数、接口或类时，为类型参数添加约束，并返回一个带有约束的泛型类型

### any

any 类型，是所有类型的超集，也可以是所有类型的子集。
一个 any 类型的值，可以赋值给任何类型的变量，也可以赋值给 any 类型的变量。
所以 any 类型没有类型检查，也没有类型推导。

### unknown

unknown 类型，所有的类型都可以赋值给 unnknown 类型，但是 unknown 类型不能赋值给任何类型除了 any 类型和 unknown 类型本身。

```ts
let a: unknown = 10
a = { name: '张三' }

let b: number = a // 错误，unknown 类型不能赋值给 number 类型
```

### never

never 类型，表示一个不会出现的值。

```ts
function error(message: string): never {
	throw new Error(message)
}

function infiniteLoop(): never {
	while (true) {}
}
```

### void

void 类型，表示一个没有返回值的函数。

```ts
function log(message: string): void {
	console.log(message)
}
```

### 字面量类型
字面量类型，是指一个具体的值，比如字符串字面量类型 "hello"，数字字面量类型 42，布尔字面量类型 true 和 false。
```ts
let a: "hello" = "hello"
```

### Array 数组类型
```ts
let numbers: number[] = [1, 2, 3]
let strings: Array<string> = ['hello', 'world']
```

### tuple 元组
元组，是一种特殊的数组类型，表示一个已知元素数量和类型的数组。
```ts
let coords: [number, number] = [10, 20]
let person: [string, number] = ['张三', 18]
```

### enum 枚举
枚举，是一种数据结构，用于定义一组常量。枚举的特点是：
1. 可以给一组数值取一个更容易理解的名字
2. 一个枚举中只会存在几个固定的值，不会出现其他值
3. 枚举的值可以为字符串，也可以为数字，没有指定枚举的值时，默认从 0 开始递增。
```ts
enum Color {
	Red,
	Green,
	Blue,
	Black = 100,
	White = 'WHITE',
}

console.log(Color.Red)
console.log(Color.Black)
console.log(Color.White)
```

### Union Types 联合类型
联合类型，是指一个值可以是多个类型中的任意一个。
```ts
let a: string | number = 10
```
### Intersection Types 交叉类型
交叉类型，是指一个值必须是多个类型中的所有类型。
```ts
type A = {
	a: number
}

type B = {
	b: string
}

type C = A & B

let c: C = {
	a: 10,
	b: 'hello',
}
```
### 自定义类型：类型别名（Type Aliases）和接口(Interfaces)
类型别名，是指为类型起一个新的名字。类型别名可以用于任何类型，包括对象、数组、函数、联合类型、交叉类型等。
```ts
type ID = number | string
type Person = {
  name: string
  age: number
  sex: '男' | '女'
}
```

接口，是指为对象定义一个类型。接口可以定义对象中的属性、方法、索引签名、可选属性、只读属性、继承、扩展等。

```ts
// 接口定义通常以I开头，后面跟着接口的名称
interface IPerson {
  name: string
  age: number
  sex: '男' | '女'
}
```

有了自定义类型后，就可以很方便在代码中复用类型了。

类型中的函数声明与可选属性
```ts

```
