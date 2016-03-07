#!/bin/bash

node_version=$(node -v);

echo "Installing i2c module for node $node_version"

npm install i2c-bus
