#!/bin/bash

set -ex

if [[ ! -e apollo-ios-cli ]]; then
	./install-apollo-cli.sh
fi

exec ./apollo-ios-cli generate "$@"
