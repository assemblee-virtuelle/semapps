import React from 'react';
import { useRecordContext } from 'react-admin';
import { Chip, Avatar, makeStyles } from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import FacebookIcon from '@material-ui/icons/Facebook';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import YouTubeIcon from '@material-ui/icons/YouTube';
import { FiGitlab } from 'react-icons/fi';

const defaultdomainMapping = {
  'github.com': {
    label: 'GitHub',
    icon: <GitHubIcon />,
    color: 'black',
    contrastText: 'white'
  },
  'gitlab.com': {
    label: 'GitLab',
    icon: <FiGitlab />,
    color: 'orange',
    contrastText: 'black'
  },
  'opencollective.com': {
    label: 'Open Collective',
    icon: <Avatar src="https://opencollective.com/static/images/opencollective-icon.svg" />,
    color: 'white',
    contrastText: '#297EFF'
  },
  'facebook.com': {
    label: 'Facebook',
    icon: <FacebookIcon />,
    color: '#4267B2',
    contrastText: 'white'
  },
  'twitter.com': {
    label: 'Twitter',
    icon: <TwitterIcon />,
    color: '#00ACEE',
    contrastText: 'white'
  },
  'instagram.com': {
    label: 'Instagram',
    icon: <InstagramIcon />,
    color: '#8a3ab9',
    contrastText: 'white'
  },
  'youtube.com': {
    label: 'YouTube',
    icon: <YouTubeIcon />,
    color: '#FF0000',
    contrastText: 'white'
  }
};
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

const MultiUrlField = ({ source, domainMapping, ...rest }) => {
  const newDomainMapping = { ...defaultdomainMapping, ...domainMapping };
  const record = useRecordContext();
  const classes = useStyles();
  const urlArray = record[source] ? (Array.isArray(record[source]) ? record[source] : [record[source]]) : [];
  return urlArray.map((url, index) => {
    if (!url.startsWith('http')) url = 'https://' + url;
    const parsedUrl = new URL(url);
    if (!parsedUrl) return null;
    const chip = newDomainMapping[parsedUrl.hostname] || {
      label: 'Site web',
      icon: <LanguageIcon />,
      color: '#ea',
      contrastText: 'black'
    };
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={classes.link}>
        <Chip
          {...rest}
          icon={React.cloneElement(chip.icon, { style: { color: chip.contrastText } })}
          size="small"
          label={chip.label}
          classes={{ root: classes.chip, label: classes.label }}
          style={{ color: chip.contrastText, backgroundColor: chip.color }}
        />
      </a>
    );
  });
};

MultiUrlField.defaultProps = {
  addLabel: true
};

export default MultiUrlField;
