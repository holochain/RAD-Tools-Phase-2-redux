#!/bin/bash

fullfilename="/home/zo-el/Documents/GitRepo/Holochain/RAD/RAD-Tools-Phase-2/keystores/agent/HcSCi7V4IJbxqvm96koNGMenxuvcsau8yGgdtZDgy35n88s7uhkYyXrSumrbtnz.keystore"
filename=$(basename "$fullfilename")
fname="${filename%.*}"
echo $fname
