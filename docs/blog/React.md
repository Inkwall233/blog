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
1. 性能问题：React 18 引入了 `useSyncExternalStore` Hook，它可以在组件中同步外部存储的数据，从而避免了在组件中重复渲染的问题。

[useSyncExternalStore](https://zh-hans.reactjs.org/docs/hooks-reference.html#usesyncexternalsource)
