#!/bin/bash

SCHEMA_PATH="src/setup/type-specs/sample-type-spec.json" && [[ $1 != "" ]] && SCHEMA_PATH=$1

npm run happ:remove
cp -r ./src/happ-template ./happ
cp $SCHEMA_PATH ./happ/
npm run ui:generate $SCHEMA_PATH
npm run hc:generate-dna $SCHEMA_PATH
npm run happ:install
cd happ
npm run hc:package
cd ..
npm run hc:generate-conductor
[ -e .cargo ] && mv .cargo ./happ/.cargo 
[ -e target ] && && mv target ./happ/target
