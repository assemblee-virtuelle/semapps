import React from 'react';
import { Grid } from '@material-ui/core';
import RightLabel from './RightLabel';

const Column = ({ basePath, children, record, resource, xs, showLabel }) => {
  return (
    <Grid item xs={xs}>
      {React.Children.map(children, field =>
        field && React.isValidElement(field) ? (
          <div key={field.props.source}>
            {field.props.addLabel && showLabel ? (
              <RightLabel
                record={record}
                resource={resource}
                basePath={basePath}
                label={field.props.label}
                source={field.props.source}
                disabled={false}
              >
                {field}
              </RightLabel>
            ) : typeof field.type === 'string' ? (
              field
            ) : (
              React.cloneElement(field, {
                record,
                resource,
                basePath
              })
            )}
          </div>
        ) : null
      )}
    </Grid>
  );
};

export default Column;
