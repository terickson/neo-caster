#! /bin/sh
rm -rf release
gulp
cd release
npm install --production
zip -r -X "neoCaster.zip" *
