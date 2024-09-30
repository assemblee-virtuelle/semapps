#!/bin/bash
set -e

declare -a operations=("compact" "deleteOld")
declare -a graphs=("" "Acl" "Mirror")

for operation in "${operations[@]}"; do
    for graph in "${graphs[@]}"; do
        # Go through all files in the /fuseki/configuration
        for filepath in /fuseki/configuration/*.ttl; do
            filename=$(basename -- "$filepath")

            # Remove .ttl extension
            dataset="${filename%.*}"

            dir="/fuseki/databases/${dataset}${graph}"

            if [ -d "$dir" ]; then
                if [ "$operation" == "compact" ]; then
                    echo "Compacting ${dir}..."
                    {
                         # TODO use --deleteOld command available in higher Fuseki versions
                        /jena-fuseki/bin/tdb2.tdbcompact --loc=${dir}
                    } || {
                        # We immediately delete any newly-created directory, to avoid potentially correct data to be removed during the deleteOld operation
                        echo "Compact job failed. Deleting new directories from ${dir}..."
                        cd "${dir}"
                        find . -iname 'Data*' ! -wholename $(find . -iname 'Data*' -type d | sort -n -r | tail -n 1)  -type d -exec rm -rf {} +
                    }
                else
                    echo "Deleting old directories from ${dir}..."
                    cd "${dir}"
                    find . -iname 'Data*' ! -wholename $(find . -iname 'Data*' -type d | sort -n | tail -n 1)  -type d -exec rm -rf {} +
                fi
            else
                echo "Directory ${dir} does not exist, skipping..."
            fi
        done
    done
done