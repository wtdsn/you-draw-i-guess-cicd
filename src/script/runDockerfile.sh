#!/bin/bash

# $1 镜像名称，可以使用仓库名称
# $2 docker run 时 ，指定端口映射，需要增加 -d 如果需求
PROJECT_DIR=$(dirname $(dirname $(dirname $(readlink -f $0))))/repositories/$1
CONTAINER_NAME=$1_c

# 如果不存在 -d 目录 -f 文件
if [ ! -d "$PROJECT_DIR" ]; then
  echo "Project not found"
  exit 1
fi

if [ ! -f "$PROJECT_DIR/Dockerfile" ]; then
  echo "Dockerfile not found"
  exit 1
fi

cd "$PROJECT_DIR"

# 停止并删除原本容器
docker stop "$CONTAINER_NAME"
docker rm "$CONTAINER_NAME"

set -e
if ! docker build -t "$1" . ; then
  echo "Docker build failed"
  exit 1
fi

if ! eval "docker run $2 --name $CONTAINER_NAME $1" ; then
  echo "Docker run failed"
  exit 1
fi

echo "Docker run successfully"
exit 0