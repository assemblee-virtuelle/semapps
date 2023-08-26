import React, { useState, useEffect } from 'react';
import { useDataProvider, useTranslate, Loading, Error } from 'react-admin';
import {
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { GROUP_AGENT, USER_AGENT, ANONYMOUS_AGENT, resourceRightsLabels, containerRightsLabels } from '../../constants';
import AgentIcon from './AgentIcon';

const useStyles = makeStyles(() => ({
  listItem: {
    paddingLeft: 4,
    paddingRight: 36
  },
  primaryText: {
    width: '30%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  secondaryText: {
    textAlign: 'center',
    width: '60%',
    fontStyle: 'italic',
    color: 'grey'
  }
}));

const AgentItem = ({ isContainer, agent, addPermission, removePermission }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    if (agent.predicate === USER_AGENT) {
      dataProvider
        .getOne('Person', { id: agent.id })
        .then(({ data }) => {
          setUser(data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [agent.id, agent.predicate]);

  // For now, do not display groups
  if (agent.predicate === GROUP_AGENT) return null;

  const openMenu = event => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const labels = isContainer ? containerRightsLabels : resourceRightsLabels;

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <ListItem className={classes.listItem}>
      <ListItemAvatar>
        <Avatar src={user?.image}>
          <AgentIcon agent={agent} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        className={classes.primaryText}
        primary={
          user
            ? user['pair:label']
            : translate(agent.id === ANONYMOUS_AGENT ? 'auth.agent.anonymous' : 'auth.agent.authenticated')
        }
      />
      <ListItemText
        className={classes.secondaryText}
        primary={agent.permissions?.map(p => translate(labels[p])).join(', ')}
      />
      <ListItemSecondaryAction>
        <IconButton onClick={openMenu} size="large">
          <EditIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={closeMenu}>
          {Object.entries(labels).map(([rightKey, rightLabel]) => {
            const hasPermission = agent.permissions?.includes(rightKey);
            return (
              <MenuItem
                key={rightKey}
                onClick={() => {
                  if (hasPermission) {
                    removePermission(agent.id, agent.predicate, rightKey);
                  } else {
                    addPermission(agent.id, agent.predicate, rightKey);
                  }
                  closeMenu();
                }}
              >
                <ListItemIcon>{hasPermission ? <CheckIcon /> : null}</ListItemIcon>
                <ListItemText primary={translate(rightLabel)} />
              </MenuItem>
            );
          })}
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default AgentItem;
