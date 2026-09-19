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
`http://localhost:8080`

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

## Docker基本概念
Docker包括三个基本概念：
+ 镜像（Image）:Docker镜像是一个特殊的文件系统 ，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的配置参数（如匿名卷、环境变量、用户等）。
+ 容器 (Container):镜像和容器的关系，就像类和实例的关系，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。
+ 仓库（Registry）：镜像构建完成后，可以很容易的在当前宿主机上运行，但是如果需要在其他服务器上使用这个镜像，就需要将镜像上传到仓库中。

### 镜像（Image）
Docker镜像是一个只读的文件系统，它包含了容器运行时所需的程序、库、资源、配置等文件。
|内容类型|实例|
|--|--|
|程序|nginx|
|库|lib|
|配置文件|nginx.conf等|
|环境变量|PATH| 
|元数据|启动命令、暴露端口、数据卷定义|

#### 分层存储：镜像的核心设计
Docker镜像采用分层存储的设计，每个镜像都是由多个分层组成的，每个分层都是一个只读的文件系统。

每一层的特点：

- **只读**：构建完成后不可修改
- **可共享**：多个镜像可以共享相同的层
- **有缓存**：未变化的层不会重新构建

#### 分层存储的 “陷阱”

> ⚠️ **笔者特别提醒**：理解这一点可以帮你避免构建出臃肿的镜像。**关键原理**：每一层的文件变化会被记录，但 **删除操作只是标记，不会真正减小镜像体积**。

```docker
## 错误示范 ❌

FROM ubuntu:24.04
RUN apt-get update
RUN apt-get install -y build-essential  # 安装编译工具（约 200MB）
RUN make && make install                  # 编译应用
RUN apt-get remove build-essential        # 试图删除编译工具

## 结果：镜像仍然包含 200MB 的编译工具！
```
```docker
## 正确做法 ✅

FROM ubuntu:24.04
RUN apt-get update && \
    apt-get install -y build-essential && \
    make && make install && \
    apt-get remove -y build-essential && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

## 在同一层完成安装、使用、清理
```

#### 镜像的标识
格式：`[仓库地址/]仓库名[:标签]`

```docker
## 完整格式

registry.example.com/myproject/myapp:v1.2.3

## 简写（使用 Docker Hub）

nginx:1.28
ubuntu:24.04

## 省略标签（默认使用 latest）

nginx  # 等同于 nginx:latest
```

## 容器（Container）
容器是镜像运行时的实体，它可以在主机上运行，也可以在其他服务器上运行。

### 容器的本质
> 容器的本质是一个隔离的进程空间，它可以在主机上运行，也可以在其他服务器上运行。

这种隔离主要通过 Linux 内核的 **Namespace** 实现，资源限制通常与 **cgroups** 配合。具体表现为：

- **进程空间**：容器看不到宿主机上的其他进程。
- **网络**：在默认网络模式下，容器通常拥有独立的网络命名空间，并可分配独立 IP；使用 `host` 或 `container:` 等模式时则例外。
- **文件系统**：容器拥有独立的 root 目录。
- **用户**：默认情况下，容器内的 `root` 仍是 `uid 0`，但通常只拥有受限 capabilities；如果启用 `userns-remap` 或 rootless 等机制，还会进一步映射为宿主机上的低权限用户。

### 容器的存储层
镜像层 + 容器层
当容器运行时，Docker会在镜像的只读层之上创建一个可写层（容器存储层）。
作用：
- 容器存储层是容器运行时的文件系统，它包含了容器运行时的所有文件。
- Copy-on-Write：写时复制机制，当容器修改文件时，Docker会在容器存储层创建一个新文件，而不是直接修改镜像层的文件。

### 容器存储层的生命周期
容器存储层与容器生命周期绑定。容器删除，数据就没了！

### 正确的数据持久化方式
方式| 说明|适用场景
|--|--|--|
|绑定挂载（Bind Mount）|将主机上的目录挂载到容器中|开发时共享代码|
|数据卷（Volume）|Docker管理的存储|数据库、应用数据|

### 容器的生命周期
容器的生命周期包括创建、启动、停止、删除等阶段。
```docker
## 创建并启动容器（最常用）

$ docker run nginx

## 分步操作

$ docker create nginx    # 创建容器（不启动）
$ docker start abc123    # 启动容器

## 停止容器

$ docker stop abc123     # 优雅停止（发送 SIGTERM，等待后发送 SIGKILL）
$ docker kill abc123     # 强制停止（直接发送 SIGKILL）

## 暂停/恢复（不常用，但有时有用）

$ docker pause abc123    # 暂停容器内所有进程
$ docker unpause abc123  # 恢复

## 删除容器

$ docker rm abc123       # 删除已停止的容器
$ docker rm -f abc123    # 强制删除运行中的容器
```

## 仓库（Repository）
仓库是存储镜像的中心，它可以在本地或远程运行。

### 镜像的推送和拉取
```doker
开发者机器                    Registry                    生产服务器
     │                           │                             │
     │  docker build             │                             │
     │  构建镜像                  │                             │
     │                           │                             │
     │  docker push ─────────────▶                             │
     │  推送镜像                  │  存储镜像                   │
     │                           │                             │
     │                           │  ◀───────────── docker pull │
     │                           │                  拉取镜像    │
     │                           │                             │
     │                           │                  docker run │
     │                           │                  运行容器    │
```

### 常用命令
```docker
## 登录 Registry

$ docker login                      # 登录 Docker Hub
$ docker login registry.example.com # 登录其他 Registry

## 拉取镜像

$ docker pull nginx:1.28

## 标记镜像（准备推送）

$ docker tag myapp:latest registry.example.com/myteam/myapp:v1.0

## 推送镜像

$ docker push registry.example.com/myteam/myapp:v1.0

## 登出

$ docker logout
```

## 使用镜像
### 获取镜像
```docker
## 拉取镜像
$ docker pull [选项] [Registry地址/]仓库名[:标签]
$ docker pull nginx:1.28
```

### 验证镜像完整性
```docker
## 查看镜像摘要
$ docker images --digests postgres
```
 ### 列出镜像
 ```docker
## 列出所有镜像
$ docker images
```
### 删除镜像
```docker
## 删除镜像
$ docker image rm [选项] <镜像1> [<镜像2> ...]
# 缩写
$ docker rmi [镜像ID] 
```

### 删除流程
Docker会检测镜像是否有容器在使用，如果有，会提示用户先删除容器。
如果没有容器在使用，Docker会直接删除镜像。

### 批量删除
虚悬镜像 (dangling)：没有标签的镜像，通常是旧版本被新版本覆盖后产生的
```docker
## 批量删除镜像
$ docker image rm -f <镜像1> [<镜像2> ...]
```
删除所有未被容器使用的镜像
```docker
## 删除所有未被容器使用的镜像
$ docker image prune
```

### 利用commit理解镜像构成
docker commit 可以将容器的当前状态保存为镜像。但是日常定制镜像时，不应直接使用 commit 命令，而应使用 Dockerfile 来构建镜像。

例如当我们在nginx容器中更改了配置文件后，我们可以使用 commit 命令将容器的当前状态保存为镜像。
```docker
$ docker run --name webserver -d -p 8080:80 nginx

$ docker exec -it webserver bash
root@3729b97e8226:/# echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
root@3729b97e8226:/# exit
exit

# 查看容器的差异
$ docker diff webserver
C /root
A /root/.bash_history
C /run
C /usr
C /usr/share
C /usr/share/nginx
C /usr/share/nginx/html
C /usr/share/nginx/html/index.html
C /var
C /var/cache
C /var/cache/nginx
A /var/cache/nginx/client_temp
A /var/cache/nginx/fastcgi_temp
A /var/cache/nginx/proxy_temp
A /var/cache/nginx/scgi_temp
A /var/cache/nginx/uwsgi_temp

## 保存容器状态为镜像
$ docker commit [选项] <容器ID> <新镜像标签>
```

### 使用Dockerfile构建镜像
镜像的定制实际上就是定制每一层所添加的配置、文件。
如果我们把每一层修改、安装构建、操作的命令都写入一个脚本，用这个脚本来构建、定制镜像，就可以避免每次构建镜像时都手动操作。这个脚本就是Dockerfile。

#### 使用docker init快速创建：推荐
Docker 提供了docker init命令，可以根据项目类型自动生成Dockerfile、.dockerignore、compose.yml和README.docker.md等文件。

使用方法如下：
```docker
$ docker init [选项] <镜像名称> [选项]
```

例如，我们可以使用以下命令创建一个基于nginx:1.28镜像的容器，容器名称为webserver，端口8080映射到容器端口80，容器内执行nginx命令。
```docker
$ docker init -d -p 8080:80 nginx:1.28

```


#### 手动创建Dockerfile


