import React, { useEffect } from 'react';
import { FilterList, FilterListItem, useGetList, getResources, useResourceContext, useListContext } from 'react-admin';
import { shallowEqual, useSelector } from 'react-redux';
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
  const { data } = useGetList(resourceContext);
  return (
    <>
      &nbsp;
      <span className="filter-count">{'(' + Object.values(data).filter(d => ([].concat(d[source])).includes(id)).length + ')'}</span>
    </>
  );
};

const ReferenceFilter = ({ reference, source, inverseSource, limit, sort, filter, label, icon, showCounters }) => {
  const { data, ids } = useGetList(reference, { page: 1, perPage: limit }, sort, filter);
  const resources = useSelector(getResources, shallowEqual);
  const currentResource = resources.filter(r => r?.name === reference)[0];
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
    if (! params.filter) {
      setFilters({});
    }
  }, []);
  
  const itemIsUsed = (id) => {
    if (!inverseSource) {
      return true;
    }
    if (!resourceContextContainers || !data || !data[id][inverseSource]) {
      return false;
    }
    let itemIsUsed = false;    
    Object.values(resourceContextContainers).forEach(value => {
      value.forEach(containerUrl => {
        [].concat(data[id][inverseSource]).forEach(inverseSourceData => {
          if (inverseSourceData.startsWith(containerUrl)) {
            itemIsUsed = true;
          }
        })
      })
    });
    return itemIsUsed;
  }
  
  return (
    <FilterList label={label || currentResource.options.label} icon={icon || React.createElement(currentResource.icon)}>
      {ids
        .filter(id => itemIsUsed(id))
        .map(id => (
          <FilterListItem
            key={id}
            label={
              <span className="filter-label">
                {data[id]['pair:label']}
                {showCounters && <ReferenceFilterCounter source={source} id={id} />}
              </span>
            }
            value={{ [source]: id }}
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
