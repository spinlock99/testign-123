#!/usr/bin/env bash

cd /home/spinlock/atomic-apps
git checkout master
git pull
yarn install
pm2 restart all

cd /tmp
if [ ! -d todo-pwa/ ]; then
  git clone git@github.com:spinlock99/todo-pwa.git
fi

cd todo-pwa
git pull
