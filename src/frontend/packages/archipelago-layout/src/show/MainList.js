import React from 'react';
import { useTranslate, getFieldLabelTranslationArgs, useShowContext } from 'react-admin';
import { Box } from '@material-ui/core';
import LargeLabel from './LargeLabel';

const MainList = ({ children }) => {
  const translate = useTranslate();
  const { basePath, loaded, record, resource } = useShowContext();
  if (!loaded) return null;

  return (
    <Box>
      {React.Children.map(children, field =>
        field && record[field.props.source] && React.isValidElement(field) ? (
          <div key={field.props.source}>
            {field.props.addLabel ? (
              <>
                <LargeLabel>
                  {translate(
                    ...getFieldLabelTranslationArgs({
                      label: field.props.label,
                      resource,
                      source: field.props.source
                    })
                  )}
                </LargeLabel>
                {React.cloneElement(field, {
                  record,
                  resource,
                  basePath
                })}
              </>
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
    </Box>
  );
};

export default MainList;
