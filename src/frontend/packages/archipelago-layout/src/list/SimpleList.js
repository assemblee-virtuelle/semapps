import React from 'react';
import { SimpleList as RaSimpleList } from 'react-admin';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

// We want the MuiListItem style to be overridden only on RA's SimpleList, so define a sub-theme.
// If we don't do that, all list items, including dropdown lists, will have a similar design.
const theme = createMuiTheme({
  overrides: {
    MuiListItem: {
      root: {
        padding: 15,
        paddingBottom: 15,
        paddingTop: 15,
        marginBottom: 10,
        borderStyle: 'solid',
        borderColor: '#e0e0e0',
        borderWidth: 1
      }
    }
  }
});

const SimpleList = props => (
  <ThemeProvider theme={theme}>
    <RaSimpleList {...props} />
  </ThemeProvider>
);

export default SimpleList;
