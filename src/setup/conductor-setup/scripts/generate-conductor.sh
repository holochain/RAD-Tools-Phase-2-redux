#!/bin/bash

[ -f ./conductor-config.toml ] && rm -rf ./conductor-config.toml
cp ./conductor-config.template.toml ./conductor-config.toml
[ ! -d ./keystores ] && mkdir keystores
[ ! -d ./keystores/agent1 ] && mkdir keystores/agent1
rm -rf ./keystores/agent1/*
hc keygen -n --path ./keystores/agent1/AGENT_1_PUB_KEY.keystore | sed -ne 's/^Public address:\.*//p' | xargs -I {} sh -c 'mv ./keystores/agent1/AGENT_1_PUB_KEY.keystore ./keystores/agent1/{}.keystore; sed -i "s/<AGENT_1_PUB_KEY>/{}/" ./conductor-config.toml'
echo "Generated new keypair for Agent 1"
echo "Added Agent 1 to Conductor"
