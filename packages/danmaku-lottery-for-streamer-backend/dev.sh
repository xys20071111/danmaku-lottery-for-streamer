#!/bin/bash

rm electron_dist -rf
yarn tsc
cd ../danmaku-lottery-for-streamer-overlay
yarn build
cp -r dist ../danmaku-lottery-for-streamer-backend/electron_dist/overlay
cd ../danmaku-lottery-for-streamer-backend/
NODE_ENV=development yarn electron .
