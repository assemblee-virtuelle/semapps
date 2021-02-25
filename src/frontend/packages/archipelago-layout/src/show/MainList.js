import React from 'react';
import { useTranslate, getFieldLabelTranslationArgs, useShowContext } from 'react-admin';
import { Box, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => {
  console.log('contrastText', theme)
  return ({
    subTitle: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(1),
    },
    subTitleSpan: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      paddingTop: theme.spacing(0.75),
      paddingBottom: theme.spacing(0.75),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(4),
    }
  })
});

const MainList = ({ children }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { basePath, loaded, record, resource } = useShowContext();
  if( !loaded ) return null;

  return (
    <Box>
      {React.Children.map(children, field => (
        field && record[field.props.source] && React.isValidElement(field) ? (
          <div key={field.props.source}>
            {field.props.addLabel ? (
              <>
                <Typography variant="h5" className={classes.subTitle}>
                  <span className={classes.subTitleSpan}>
                    {translate(
                      ...getFieldLabelTranslationArgs({
                        label: field.props.label,
                        resource,
                        source: field.props.source
                      })
                    )}
                  </span>
                </Typography>
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
      ))}
    </Box>
  );
};

export default MainList;
