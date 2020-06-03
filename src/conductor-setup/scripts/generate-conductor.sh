#!/bin/bash

DESTINATION_PATH=./happ

[ -f $DESTINATION_PATH/conductor-config.toml ] && rm -rf $DESTINATION_PATH/conductor-config.toml
mv $DESTINATION_PATH/conductor-config.template.toml $DESTINATION_PATH/conductor-config.toml
[ ! -d $DESTINATION_PATH/keystores ] && mkdir $DESTINATION_PATH/keystores
[ ! -d $DESTINATION_PATH/keystores/agent1 ] && mkdir $DESTINATION_PATH/keystores/agent1
rm -rf $DESTINATION_PATH/keystores/agent1/*
hc keygen -n --path $DESTINATION_PATH/keystores/agent1/AGENT_1_PUB_KEY.keystore | sed -ne 's/^Public address:\.*//p' | xargs -I {} sh -c "mv $DESTINATION_PATH/keystores/agent1/AGENT_1_PUB_KEY.keystore $DESTINATION_PATH/keystores/agent1/{}.keystore; sed -i \"s/<AGENT_1_PUB_KEY>/{}/\" $DESTINATION_PATH/conductor-config.toml"
echo "Generated new keypair for Agent 1"
echo "Added Agent 1 to Conductor"
