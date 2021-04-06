import React from 'react';
import { FilterList, FilterListItem, useGetList, getResources } from 'react-admin';
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
const ReferenceFilter = ({ reference, source, inverseSource, limit, sort, filter, label, icon }) => {
  const { data, ids } = useGetList(reference, { page: 1, perPage: limit }, sort, filter);
  const resources = useSelector(getResources, shallowEqual);
  const currentResource = resources.filter(r => r?.name === reference)[0];
  return (
    <FilterList label={label || currentResource.options.label} icon={icon || React.createElement(currentResource.icon)}>
      {ids
        .filter(id => !inverseSource || data[id][inverseSource])
        .map(id => (
          <FilterListItem key={id} label={data[id]['pair:label']} value={{ [source]: id }} />
        ))}
    </FilterList>
  );
};

ReferenceFilter.defaultProps = {
  limit: 25
};

export default ReferenceFilter;
