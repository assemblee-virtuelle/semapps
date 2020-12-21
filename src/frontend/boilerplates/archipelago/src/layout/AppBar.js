import React from 'react';
import { Container, Box, Grid, makeStyles, Typography, AppBar as MuiAppBar } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  header: {
    position: 'relative',
    height: 65
  },
  logo: {
    position: 'relative',
    top: 10,
    width: 45,
    height: 45,
    verticalAlign: 'middle'
  },
  logoText: {
    fontFamily: 'Helvetica',
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.palette.common.white,
    verticalAlign: 'middle',
    position: 'relative',
    top: 10
  },
  menuLink: {
    textDecoration: 'none'
  },
  menuText: {
    fontFamily: 'Helvetica',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 1,
    color: theme.palette.common.white
  }
}));

const menuItems = {
  '/': 'Accueil',
  '/Project': 'Frise\ndes actions',
  '/Organization': 'Annuaire\ndes acteurs',
  '/Event': 'Agenda\npartagé',
  '/Member': 'Trombino\nscope',
  '/Document': 'Médiathèque'
};

const AppBar = ({ userMenu, logout }) => {
  const classes = useStyles();
  return (
    <MuiAppBar position="sticky">
      <Container maxWidth="lg" className={classes.header}>
        <Grid container>
          <Grid item sm={4}>
            <Link to="/" className={classes.menuLink}>
              <img src={process.env.PUBLIC_URL + '/colibris-blanc.png'} alt="Colibris" className={classes.logo} />
              <span className={classes.logoText}>Colibris Pays Creillois</span>
            </Link>
          </Grid>
          <Grid item sm={8} align="right">
            <Grid container>
              {Object.keys(menuItems).map(link => (
                <Grid item sm={2} key={link}>
                  <Box
                    display="flex"
                    height={50}
                    p={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Link to={link} className={classes.menuLink}>
                      <Typography className={classes.menuText}>
                        {menuItems[link].split('\n').map((item, key) => (
                          <React.Fragment key={key}>{item}<br/></React.Fragment>
                        ))}
                      </Typography>
                    </Link>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </MuiAppBar>
  );
};

export default AppBar;
