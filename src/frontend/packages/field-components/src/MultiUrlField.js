import React from 'react';
import { useRecordContext } from 'react-admin';
import { Chip, Avatar, makeStyles } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
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
    icon: <Avatar component="span" src="https://opencollective.com/static/images/opencollective-icon.svg" />,
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

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'unset',
    '& :hover': {
      cursor: 'pointer'
    }
  },
  chip: {
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 5,
    marginBottom: 5
  },
  label: {
    marginTop: -1
  }
}));

const MultiUrlField = ({ source, domainMapping }) => {
  const newDomainMapping = { ...defaultdomainMapping, ...domainMapping };
  const record = useRecordContext();
  const classes = useStyles();
  const urlArray = record[source] ? (Array.isArray(record[source]) ? record[source] : [record[source]]) : [];
  return urlArray.map((url, index) => {
    if (!url.startsWith('http')) url = `https://${url}`;

    let parsedUrl = null;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return null;
    }

    const chip = newDomainMapping[parsedUrl.hostname] || {
      label: 'Site web',
      icon: <LanguageIcon />,
      color: '#ea',
      contrastText: 'black'
    };
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={classes.link} key={index}>
        <Chip
          component="span"
          icon={React.cloneElement(chip.icon, { style: { color: chip.contrastText, width: 18, height: 18 } })}
          size="small"
          label={chip.label}
          classes={{ root: classes.chip, label: classes.label }}
          style={{ color: chip.contrastText, backgroundColor: chip.color }}
        />
      </a>
    );
  });
};

export default MultiUrlField;
