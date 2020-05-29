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
# [ -e .cargo ] && [ -d ./happ ] && mv .cargo ./happ/.cargo; $PWD
# [ -e target ] && [ -d ./happ ] && mv target ./happ/target; $PWD
