#!/bin/bash
set -e

declare -a graphs=("" "Acl" "Mirror")

for graph in "${graphs[@]}"; do
    # Go through all files in the /fuseki/configuration
    for filepath in /fuseki/configuration/*.ttl; do
        filename=$(basename -- "$filepath")

        # Remove .ttl extension
        dataset="${filename%.*}"

        dir="/fuseki/databases/${dataset}${graph}"

        if [ -d "$dir" ]; then
            echo "Deleting old directories from ${dir}..."
            cd "${dir}"
            find . -iname 'Data*' ! -wholename $(find . -iname 'Data*' -type d | sort -n | tail -n 1)  -type d -exec rm -rf {} +
        else
            echo "Directory ${dir} does not exist, skipping..."
        fi
    done
done
