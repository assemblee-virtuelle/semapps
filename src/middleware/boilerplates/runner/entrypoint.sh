#!/bin/bash

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd ${CURRENT_DIR}/jwt || exit

if [ ! -f "jwtRS256.key" ]; then
  ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key -P ""
  openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub ;
else
  echo "Public/private keys already exist, skipping..." ;
fi

npm run start
