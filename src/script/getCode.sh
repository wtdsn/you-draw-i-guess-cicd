#!/bin/bash

REPO_URL=$1
DEST_DIR=$(dirname $(dirname $(dirname $(readlink -f $0))))/repositories

# 创建目录
if [ ! -d "$DEST_DIR" ]; then
  mkdir -p "$DEST_DIR"
fi

if [ -d "$DEST_DIR/$2" ]; then
  rm -rf "$DEST_DIR/$2"
fi

cd "$DEST_DIR"

git clone "$REPO_URL" $2

if [ $? -ne 0 ]; then
  echo "Failed to clone repository."
  exit 1
fi

echo "Repository cloned successfully."
exit 0