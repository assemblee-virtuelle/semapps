import React, { useState, useEffect } from 'react';
import { ArrayField, useDataProvider, useResourceContext } from 'react-admin';
import { default as FilteredArrayField } from './FilteredArrayField';
import { Typography, Box } from '@material-ui/core';

const ReifiedArrayField = ({ children, groupReference, groupLabel, filterProperty, groupVariant, ...otherProps }) => {
  const dataProvider = useDataProvider();
  const [groupes, setGroups] = useState();

  useEffect(() => {
    if (!groupes) {
      dataProvider.getResources().then(resources => {
        const resource = resources.data[groupReference];
        dataProvider
          .getList(groupReference, { '@id': resource.containerUri })
          .then(groupes => {
            setGroups(groupes.data);
          })
          .catch(e => {
            setGroups([]);
          });
      });
    }
  }, [groupes]);

  return (
    <>
      {groupes?.map((group, index) => {
        let filter = {};
        filter[filterProperty] = group.id;
        return (
          <Box key={index}>
            <Typography variant={groupVariant} align="left" noWrap>
              {group[groupLabel]}
            </Typography>
            <FilteredArrayField {...otherProps} filter={filter} label={group[groupLabel]} addLabel={true}>
              {React.Children.only(children, (child, i) => {
                return React.cloneElement(child, {});
              })}
            </FilteredArrayField>
          </Box>
        );
      })}
    </>
  );
};

ReifiedArrayField.defaultProps = {
  addLabel: true
};

export default ReifiedArrayField;
