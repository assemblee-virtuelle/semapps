import React, { useState, useEffect } from 'react';

/**
 * @example
 * <Show>
 *   <FilterHandler
 *     source="property" // ex pair:organizationOfMembership
 *     filter={{
 *       'propertyToFilter':'value'
 *     }} // ex {{'pair:membershipRole':'http://localhost:3000/membership-roles/role-1'}}
 *     >
 *     <SingleFieldList>
 *    </SingleFieldList>
 *   </FilterHandler>
 * </Show>
 */

const FilterHandler = ({ children, record, filter, source, ...otherProps }) => {
  const [filtered, setFiltered] = useState();
  useEffect(() => {
    if (record && source && Array.isArray(record?.[source])) {
      const filteredData = record?.[source].filter(r => {
        let eq = true;
        for (const key in filter) {
          const value = r[key];
          if (Array.isArray(value)) {
            if (!value.includes(filter[key])) {
              eq = false;
            }
          } else if (value !== filter[key]) {
            eq = false;
          }
        }
        return eq;
      });
      const newRecord = {
        ...record
      };
      // undefined setted if no data to obtain no render in RightLabel or equivalent
      newRecord[source] = filteredData.length > 0 ? filteredData : undefined;
      setFiltered(newRecord);
    }
  }, [record, source, filter]);

  return (
    <>
      {React.Children.map(children, (child, i) => {
        return React.cloneElement(child, {
          ...otherProps,
          record: filtered,
          source
        });
      })}
    </>
  );
};
export default FilterHandler;
