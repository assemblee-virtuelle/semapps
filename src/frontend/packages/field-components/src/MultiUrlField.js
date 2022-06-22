import React from 'react';
import { useRecordContext } from 'react-admin';
import { Chip, makeStyles } from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: 'unset',
    '& :hover': {
      cursor: 'pointer'
    }
  },
  chip: {
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 5
  },
  label: {
    marginTop: -1
  }
}));

const MultiUrlField = ({ source, ...rest }) => {
  const record = useRecordContext();
  const classes = useStyles();
  const urlArray = record[source] ? Array.isArray(record[source]) ? record[source] : [record[source]] : [];
  return (
    urlArray.map(url => {
      if( !url.startsWith('http') ) url = 'https://' + url;
      const parsedUrl = new URL(url);
      if( !parsedUrl ) return null;
      const parseUrlString = parsedUrl.toString();
      const chip = { label: parseUrlString, icon: <LanguageIcon />, color: '#ea', contrastText: 'black' };
      return(
        <a href={url} target="_blank" rel="noopener noreferrer" className={classes.link}>
          <Chip
            icon={React.cloneElement(chip.icon, { style: { color: chip.contrastText } })}
            size="small"
            label={chip.label}
            classes={{ root: classes.chip, label: classes.label }}
            style={{ color: chip.contrastText, backgroundColor: chip.color }}
            {...rest}
          />
        </a>
      )
    })
  );
};

MultiUrlField.defaultProps = {
  addLabel: true
};

export default MultiUrlField;
