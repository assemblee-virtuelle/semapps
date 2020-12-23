import * as React from 'react';
import { Grid, Card, CardContent, makeStyles } from '@material-ui/core';
import Document from './Document';
import DocumentsFolder from './DocumentsFolder';

const useStyles = makeStyles(theme => ({
  card: {
    marginTop: 72
  },
  document: {
    paddingTop: 5
  }
}));

const Home = () => {
  const classes = useStyles();
  return (
    <>
      <Card className={classes.card}>
        <Grid container spacing={3}>
          <Grid item xs={9}>
            <CardContent className={classes.document}>
              <Document id="bienvenue-sur-le-wiki-du-groupe-local-colibris-pays-creillois" />
            </CardContent>
          </Grid>
          <Grid item xs={3}>
            <CardContent>
              <DocumentsFolder folderId="http://localhost:3000/folders/fondamentaux" />
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default Home;
