#!/usr/bin/env bash

cd /home/spinlock/atomic-apps
git checkout master
git pull
yarn install
# zeromq neads node-gyp to run in the post install step. yarn isn't doing this
# now so we force it with npm.
npm install zeromq
pm2 restart all
