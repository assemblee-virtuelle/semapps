import React, { useState, useEffect, createElement } from 'react';
import { ArrayField, useDataProvider, useResourceContext, getResources, useQueryWithStore } from 'react-admin';
import { default as FilteredArrayField } from './FilteredArrayField';
import { Typography, Box } from '@material-ui/core';
import { shallowEqual, useSelector } from 'react-redux';

/*
 * @example Simple group label
 * <GroupedArrayField
 *   source="property" // predicat of main record to show / ex pair:organizationOfMembership
 *   groupReference="RAresource" // React-Admin resource reference. this is the "group by" ressource. / ex MembershipRole
 *   groupLabel="property of RAresource display" // property of React-Admin resource to display. children call whith props "label" filled by groupLabel property of groupReference
 *   filterProperty="property of source filtered by groupReference"
 * >
 *   <RightLabel>
 *     <ArrayField source="property"> // same props as GroupedArrayField source
 *       <GridList>
 *       </GridList>
 *     </ArrayField>
 *   </RightLabel>
 * </GroupedArrayField>
 */
const GroupedArrayField = ({
  children,
  groupReference,
  groupLabel,
  filterProperty,
  ...otherProps
}) => {
  const { data } = useQueryWithStore({
    type: 'getList',
    resource: groupReference,
    payload: {}
  });

  return (
    <>
      {data?.map((data, index) => {
        let filter = {};
        filter[filterProperty] = data.id;
        return (
          <FilteredArrayField {...otherProps} filter={filter} label={data[groupLabel]}>
            {children}
          </FilteredArrayField>
        );
      })}
    </>
  );
};

GroupedArrayField.defaultProps = {
  addLabel: true
};

export default GroupedArrayField;
