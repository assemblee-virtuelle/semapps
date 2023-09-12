import React, { useEffect } from 'react';
import { FilterList, FilterListItem, useGetList, useResourceContext, useListContext, useResourceDefinition } from 'react-admin';
import { useContainers, useDataModel } from '@semapps/semantic-data-provider';

/**
 * @example
 * const FilterAside = () => (
 *   <Card>
 *     <CardContent>
 *       <FilterLiveSearch source="pair:label" />
 *       <ReferenceFilter reference="Theme" source="pair:hasTopic" inverseSource="pair:topicOf" />
 *       <ReferenceFilter reference="Skill" source="pair:offers" inverseSource="pair:offeredBy" />
 *     </CardContent>
 *   </Card>
 * );
 */

const ReferenceFilterCounter = ({ source, id }) => {
  const resourceContext = useResourceContext();
  const { data, isLoading } = useGetList(resourceContext);
  return (
    <>
      &nbsp;
      { ! isLoading &&
        <span className="filter-count">{`(${  Object.values(data).filter(d => ([].concat(d[source])).includes(id)).length  })`}</span>
      }
    </>
  );
};

const ReferenceFilter = ({ reference, source, inverseSource, limit, sort, filter, label, icon, showCounters }) => {
  const { data, isLoading } = useGetList(reference, { page: 1, perPage: limit }, sort, filter);
  const currentResource = useResourceDefinition({resource: reference});
  const resourceContext = useResourceContext();
  const resourceContextDataModel = useDataModel(resourceContext);
  const resourceContextContainers = useContainers(resourceContext);

  const {
    displayedFilters,
    filterValues,
    setFilters,
    hideFilter
  } = useListContext();
  useEffect(() => {
    // Needed when filter item is active and its last relation is removed
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (! params.filter && ! isLoading) {
      setFilters({});
    }
  }, []);
  
  const itemIsUsed = (itemData) => {
    if (!inverseSource) {
      return true;
    }
    if (!resourceContextContainers || !itemData) {
      return false;
    }
    let itemIsUsed = false;
    Object.values(resourceContextContainers).forEach(value => {
      value.forEach(containerUrl => {
        [].concat(itemData[inverseSource]).forEach(inverseSourceData => {
          if (inverseSourceData?.startsWith(containerUrl)) {
            itemIsUsed = true;
          }
        })
      })
    });
    return itemIsUsed;
  }
  
  return (
    <FilterList
      label={label || currentResource?.options?.label || ''}
      icon={icon || currentResource?.icon ? React.createElement(currentResource.icon) : undefined}
    >
      {data && data
        .filter(itemData => itemIsUsed(itemData))
        .map(itemData => (
          <FilterListItem
            key={itemData.id}
            label={
              <span className="filter-label">
                {itemData['pair:label']}
                {showCounters && <ReferenceFilterCounter source={source} id={itemData.id} />}
              </span>
            }
            value={{ [source]: itemData.id }}
          />
        ))}
    </FilterList>
  );
};

ReferenceFilter.defaultProps = {
  limit: 25,
  showCounters: true
};

export default ReferenceFilter;
