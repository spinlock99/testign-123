#!/usr/bin/env bash

cd /home/spinlock/atomic-apps
git checkout master
git pull
yarn install
pm2 restart all
