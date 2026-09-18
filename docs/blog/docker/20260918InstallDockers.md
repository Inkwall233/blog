---
date: 2026-09-18
tags: 
  - 技术
  - Docker
categories:
  - 学习总结
---

> 发现一个很好的docker书籍，https://github.com/yeasy/docker_practice  开始学习
# Docker 入门到实践一
## 安装docker
### Windows 安装docker desktop
安装docker desktop，选择安装docker desktop for windows
大概率会遇到安装失败的情况，需要开启 “适用于Linux的Windows子系统”及需要安装wsl2
资料参考
https://github.com/tech-shrimp/docker_installer
### Linux 安装docker
```bash
sudo curl -fsSL https://get.docker.com| bash -s docker --mirror Aliyun
```
### 配置镜像
```json
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1ms.run",
    "https://docker.aityp.com"
  ]
}
```

## 快速上手
### 新建一个hello-docker文件夹
```bash
mkdir hello-docker
cd hello-docker
```
### 创建一个html文件
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>
        Hello World
    </h1>
</body>

</html>
```
### 编写Dockerfile
在hello-docker文件夹下创建一个Dockerfile文件，没有后缀名
```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
```
### 构建镜像
```bash
$ docker build -t my-hello-world .
```
+ `docker build`: 构建镜像
+ `-t`: 指定镜像名称
+ `.`: 表示当前目录

### 运行容器
```bash
$ docker run -d -p 8080:80 my-hello-world
```
+ `docker run`: 运行容器
+ `-p`: 映射端口，将容器的80端口映射到主机的8080端口
+ `my-hello-world`: 镜像名称
+ `-d`: 后台运行容器

### 访问容器
http://localhost:8080

### 清理
```bash
# 查看容器
$ docker ps

# 停止容器
$ docker stop my-hello-world

# 删除容器
$ docker rm my-hello-world
```

## 什么是docker
> Docker是一种轻量的虚拟化技术，它可以在不改变主机系统的情况下，在主机上运行多个隔离的容器。

Docker的核心价值：解决“我本地明明是正常的”的问题。

### Docker VS 虚拟机
+ Docker 是一种轻量级的虚拟化技术，它可以在不改变主机系统的情况下，在主机上运行多个隔离的容器。
+ 虚拟机是一种重量级的虚拟化技术，它需要在主机上安装一个完整的操作系统，然后在操作系统上运行应用。

### Docker的核心流程
+ 构建镜像
+ 运行容器
就如前面的步骤，我们可以在本地运行一个hello world的容器，然后访问容器的8080端口，就可以看到hello world的页面。