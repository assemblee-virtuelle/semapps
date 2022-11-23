#!/bin/bash
set -e

cd /fuseki/databases

# Go through all directories in the /fuseki/databases
for dir in */; do
    echo "Compacting /fuseki/databases/${dir::-1}..."

    /jena-fuseki/bin/tdb2.tdbcompact --loc=/fuseki/databases/${dir::-1}

    # Wait 5 seconds to ensure the compacting is finished (this is usually done in less than 2 seconds)
    sleep 5

    # Remove the old Data directory
    cd /fuseki/databases/${dir::-1}
    find . -iname 'Data*' ! -wholename $(find . -iname 'Data*' -type d | sort -n | tail -n 1)  -type d -exec rm -rf {} +
done
