#! /bin/bash

SITE_PATH='/usr/local/music-webapp'
USER='wxperia'
USERGROUP='admin'

cd $SITE_PATH
git reset --hard origin/master
git clean -f
git pull
git checkout master
cnpm run build
chown -R $USER:$USERGROUP $SITE_PATH