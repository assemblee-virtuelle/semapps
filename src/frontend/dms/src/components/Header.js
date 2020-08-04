import React from "react";
import { Container, Box, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  header: {
    position: 'relative',
    height: 65,
    marginBottom: 35
  },
  logo: {
    position: 'absolute',
    top: -15,
    height: 110,
    width: 110
  }
}));

const Header = () => {
  const classes = useStyles();
  return(
    <Box bgcolor="primary.main">
      <Container maxWidth="lg" className={classes.header}>
        <Link to="/Project">
          <img
            src={process.env.PUBLIC_URL + '/av.png'}
            alt="Assemblée Virtuelle"
            className={classes.logo}
          />
        </Link>
      </Container>
    </Box>
  );
};

export default Header;
