import React, { useState, useEffect, createElement } from 'react';
import { ArrayField, useDataProvider, useResourceContext, getResources, useQueryWithStore } from 'react-admin';
import { default as FilteredArrayField } from './FilteredArrayField';
import { Typography, Box } from '@material-ui/core';
import { shallowEqual, useSelector } from 'react-redux';

/**
 * @example 1 : simple group label
 * <GroupedArrayField
 *   source="property"
 *   groupReference="RAresource"
 *   groupLabel="property of RAresource display"
 *   groupVariant="Typography MaterialUI variant"
 *   filterProperty="property of source filtered by groupReference"
 * >
 *   <SingleFieldList>
 *   </SingleFieldList>
 * </GroupedArrayField>
 */

/**
 * @example 2 : custom group label
 * <GroupedArrayField
 *   source="property"
 *   groupReference="RAresource"
 *   groupComponent={({record, ...otherProps })=>
 *     <RightLabel label={record['property of RAresource display']}/>
 *   }
 *   filterProperty="property of source filtered by groupReference"
 * >
 *   <SingleFieldList>
 *   </SingleFieldList>
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
