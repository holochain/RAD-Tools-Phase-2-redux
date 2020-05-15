#!/bin/bash

SCHEMA_PATH = "src/setup/type-specs/sample-type-spec.json" && [[ $1 != "" ]] && SCHEMA_PATH = $1

echo "Schema Path:"
echo $SCHEMA_PATH

exit

npm run happ:remove
cp -r src/happ-template happ
cp $SCHEMA_PATH src/happ-template/
npm run ui:generate $SCHEMA_PATH
npm run hc:generate-dna $SCHEMA_PATH
npm run happ:install
cd happ
npm run hc:package
cd ..
npm run hc:generate-conductor
mv ./.cargo ./happ/.cargo && mv ./.target ./happ/.target
