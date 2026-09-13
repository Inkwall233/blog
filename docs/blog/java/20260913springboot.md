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