#!/bin/bash

node_version=$(node -v);

echo "Installing i2c module for node $node_version"

if [[ $node_version == *"v0.10."* ]]; then
  npm install i2c-bus
else
  npm install i2c-bus
fi
