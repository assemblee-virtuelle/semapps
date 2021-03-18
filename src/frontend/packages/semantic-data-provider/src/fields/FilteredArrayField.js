import React, { useState, useEffect } from 'react';
import { ArrayField } from 'react-admin';

const FilteredArrayField = ({ children, record, filter, source, ...otherProps }) => {
  const [filtered, setFiltered] = useState();
  useEffect(() => {
    if (record && source && Array.isArray(record[source])) {
      const filteredData = record[source].filter(r => {
        let eq = true;
        for (const key in filter) {
          const value = r[key];
          if (Array.isArray(value)) {
            if (!value.includes(filter[key])) {
              eq = false;
            }
          } else {
            if (value !== filter[key]) {
              eq = false;
            }
          }
        }
        return eq;
      });
      let newRecord = {
        ...record
      };
      newRecord[source] = filteredData;
      setFiltered(newRecord);
    }
  }, [record, source, filter]);

  return (
    <ArrayField record={filtered} source={source} {...otherProps} addLabel={true}>
      {React.Children.only(children, (child, i) => {
        return React.cloneElement(child, {});
      })}
    </ArrayField>
  );
};

FilteredArrayField.defaultProps = {
  addLabel: true
};

export default FilteredArrayField;
