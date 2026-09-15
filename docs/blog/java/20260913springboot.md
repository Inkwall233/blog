---
date: 2026-09-13
tags: 
  - 技术
  - JAVA
categories:
  - 学习总结
---
# Spring Boot
springboot 是一个基于 spring 框架的快速开发框架，它提供了快速、方便的开发环境，帮助开发者快速构建应用。
## 创建Spring Boot项目
使用IDE进行创建

第一步

+ 生成器 ：Spring Boot
+ 语言 ：JAVA
+ 类型 ：Maven
+ JDK ： 17
+ JAVA： 17
+ 打包：Jar包
+ 配置：application.properties

第二步

+ 依赖选择
 可以先不选，等后面实际开发中再添加

JDK是Java开发工具包，包含了Java的运行环境（JRE）和开发工具（如Java编译器、调试器等）。
JAVA是Java语言，是JDK的核心部分，用于编写Java应用程序。

## 配置
+ application.properties
    作用：Spring Boot的配置文件，用于配置应用的运行环境、数据库连接等。
    语法：键值对格式，每个键值对之间用等号（=）分隔。

+ application.yml
    作用：Spring Boot的配置文件，用于配置应用的运行环境、数据库连接等。
    语法：YAML格式，使用缩进表示层级关系。

## 开发一个接口
首先要添加依赖
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>3.1.1</version>
    </dependency>
</dependencies>
```
> 这里添加了spring-boot-starter-web依赖，用于开发RESTful API接口。Spring MVC是Spring框架的一个模块，用于处理HTTP请求和响应。

核心注解
+ @RestController
    作用：Spring MVC的注解，用于处理HTTP请求和响应。SpringBoot会自动扫描@RestController注解的类，将其作为控制器。
+ @RequestMapping
    作用：指定处理的请求路径。
+ @GetMapping
    作用：指定处理GET请求。
+ @PostMapping
    作用：指定处理POST请求。
+ @RequestParam
    作用：指定处理GET请求的参数。
+ @RequestBody
    作用：指定处理POST请求的参数，将请求体转换为Java对象。

```java
@RestController
public class HelloController {
    @RequestMapping("/api")
    @GetMapping("/hello")
    public String hello(@RequestParam(defaultValue = "") String name) {
        return "hello world" + name;
    }

    @PostMapping("updateUser")
    public Boolean updateUser(@RequestBody User user) {
        System.out.println("name:" + user.getName());
        return Boolean.TRUE;
    }

}

```
## RestFul 风格
RestFul 风格是一种基于 HTTP 协议的 API 设计风格，它将资源（Resource）作为 API 的中心，通过 HTTP 请求方法来操作资源。

传统接口 VS RestFul 风格
+ 传统方式： /getUser、/deleteUrl，在url里面写动作，如getUser、deleteUrl
+ RestFul 风格：将资源（如数据库表、文件等）作为 API 的中心，通过 HTTP 请求方法来操作资源。
  + GET：获取资源，如查询用户列表
  + DELETE：删除资源，如删除用户
  + POST：创建资源，如创建用户
  + PUT：更新资源，如更新用户信息

```java
package com.example.demo.controller;

import com.example.demo.entity.User;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    @RequestMapping("/user")
    @GetMapping("/{id}")
    public String getUser(@PathVariable Long id) {
        return "getUser" + id;
    }

    @PostMapping("/")
    public String save(@RequestBody User user){
        return "用户新增成功";
    }

    @PutMapping("/{id}")
    public String update(@PathVariable long id, @RequestBody User user) {
        return "yy用户更新成功";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable long id) {
        return "yy用户删除成功";
    }
}
```
