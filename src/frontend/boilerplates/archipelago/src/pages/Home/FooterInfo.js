import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  list: {
    fontSize: 13,
    color: 'grey',
    padding: 0,
    margin: 0,
    marginTop: 25,
    '& li': {
      display: 'block',
      float: 'left',
      paddingRight: 7,
      '&::after': {
        paddingLeft: 7,
        content: "' | '"
      },
      '&:last-child': {
        '&::after': {
          content: "''"
        }
      }
    }
  }
}));

const FooterInfo = ({ children }) => {
  const classes = useStyles();
  return (
    <ul className={classes.list}>
      {React.Children.map(children, child => (
        <li>{child}</li>
      ))}
    </ul>
  );
};

export default FooterInfo;
