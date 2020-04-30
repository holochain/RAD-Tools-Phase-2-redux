#!/bin/bash

fullfilename="/path/to/dir/keystores/<agent_name>/<agent_pub_key>.keystore"
filename=$(basename "$fullfilename")
fname="${filename%.*}"
echo $fname
