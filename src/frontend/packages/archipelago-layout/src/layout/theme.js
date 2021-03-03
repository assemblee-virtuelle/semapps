import { createMuiTheme } from '@material-ui/core';

// Allow to use breakpoints
const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  palette: {
    primary: { main: '#28ccfb', contrastText: '#fff' },
    secondary: { main: '#bcef5b' },
    grey: { main: '#e0e0e0' }
  },
  typography: {
    details: {
      fontSize: 8
    }
  },
  overrides: {
    RaChipField: {
      chip: {
        marginLeft: 0,
        marginTop: 0,
        marginRight: 8,
        marginBottom: 8
      }
    },
    RaShow: {
      card: {
        padding: 25,
        [defaultTheme.breakpoints.down('xs')]: {
          padding: 15
        }
      }
    },
    RaList: {
      content: {
        padding: 25,
        [defaultTheme.breakpoints.down('xs')]: {
          padding: 15
        }
      }
    },
    // Hide top actions bar in mobile for list pages
    RaListToolbar: {
      toolbar: {
        [defaultTheme.breakpoints.down('xs')]: {
          height: 0,
          minHeight: 0
        }
      }
    },
    RaSingleFieldList: {
      root: {
        marginTop: 0,
        marginBottom: 0
      }
    },
    MuiTab: {
      labelIcon: {
        paddingTop: 0
        // minHeight: 0
      }
      // wrapper: {
      //   alignItems: null,
      //   flexDirection: null
      // }
    }
  }
});

export default theme;
