#!/bin/bash

for i in {1..10}; do
  echo "Request $i:"
  curl -s localhost:3000/x
  echo -e "\n---"
done
