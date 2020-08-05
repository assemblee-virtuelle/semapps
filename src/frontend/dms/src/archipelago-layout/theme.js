import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#28ccfb' },
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
        padding: 25
      }
    },
    RaList: {
      content: {
        padding: 25
      }
    },
    RaSingleFieldList: {
      root: {
        marginTop: 0,
        marginBottom: 0
      }
    },
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
    },
    // MuiTab: {
    //   labelIcon: {
    //     minHeight: 0,
    //   },
    //   wrapper: {
    //     alignItems: null,
    //     flexDirection: null
    //   }
    // }
  }
});

export default theme;
