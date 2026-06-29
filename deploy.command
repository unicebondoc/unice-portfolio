#!/usr/bin/env bash
# Double-click this file in Finder to deploy the site.
# (It just runs deploy.sh with an auto timestamp message.)
cd "$(dirname "$0")"
./deploy.sh
echo ""
echo "Press any key to close…"
read -n 1 -s
