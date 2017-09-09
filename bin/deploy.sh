#!/bin/sh

systemctl stop lw_web.service
rm -rf lw_web
git clone https://github.com/angelsaga/lw_web.git
cd lw_web
cnpm i
cp ../config.js bin/
systemctl daemon-reload
systemctl start lw_web.service
