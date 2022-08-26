import React from 'react';
import { FilterList, FilterListItem, useGetList, getResources, useResourceContext } from 'react-admin';
import { shallowEqual, useSelector } from 'react-redux';

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

const ReferenceFilterCounter = ({source, id}) => {
  const resourceContext = useResourceContext();
  const { data } = useGetList(resourceContext);
  return (
    <>
      &nbsp;
      <span className='filter-count'>
        {'(' + Object.values(data).filter(d => d[source]===id).length + ')'}
      </span>
    </>
  )
}

const ReferenceFilter = ({ reference, source, inverseSource, limit, sort, filter, label, icon, showCounters }) => {
  const { data, ids } = useGetList(reference, { page: 1, perPage: limit }, sort, filter);
  const resources = useSelector(getResources, shallowEqual);
  const currentResource = resources.filter(r => r?.name === reference)[0];
  return (
    <FilterList label={label || currentResource.options.label} icon={icon || React.createElement(currentResource.icon)}>
      {ids
        .filter(id => !inverseSource || data[id][inverseSource])
        .map(id => (
          <FilterListItem
            key={id}
            label={ 
                <span className='filter-label'>
                  {data[id]['pair:label']}
                  {showCounters && 
                    <ReferenceFilterCounter source={source} id={id} />
                  }
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
