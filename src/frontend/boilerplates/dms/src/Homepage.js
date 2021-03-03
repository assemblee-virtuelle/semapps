import * as React from 'react';
import { useAuthState, Loading } from 'react-admin';
import { defaultTheme } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';

const Homepage = ({ theme }) => {
    
    const { loading, authenticated } = useAuthState();

    return (
        <ThemeProvider theme={createMuiTheme(defaultTheme)}>

          { authenticated && <Card>
            <Title title="SemApps" />
            <CardContent>
              <h1>Welcome to SemApps</h1>
              Choose a container in the left menu
            </CardContent>
          </Card> }

          { !authenticated && loading &&  <Loading /> }

          { !authenticated && !loading && <> <h1> Not logged in</h1>  </>}

        </ThemeProvider>
    );
};

export default Homepage;
