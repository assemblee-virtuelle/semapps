import React, { useState, useEffect } from 'react';
import { useDataProvider, Loading, Error } from 'react-admin';
import {
  makeStyles,
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import { GROUP_AGENT, USER_AGENT, ANONYMOUS_AGENT, rightsLabel } from '../../constants';
import AgentIcon from "./AgentIcon";

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

const AgentItem = ({ agent, addPermission, removePermission }) => {
  const classes = useStyles();
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

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <ListItem button className={classes.listItem}>
      <ListItemAvatar>
        <Avatar src={user?.image}><AgentIcon agent={agent} /></Avatar>
      </ListItemAvatar>
      <ListItemText
        className={classes.primaryText}
        primary={user ? user['pair:label'] : agent.id === 'foaf:Agent' ? 'Tous les utilisateurs' : 'Utilisateurs connectés'} />
      <ListItemText
        className={classes.secondaryText}
        primary={agent.permissions && agent.permissions.map(p => rightsLabel[p]).join(', ')}
      />
      <ListItemSecondaryAction>
        <IconButton onClick={openMenu}>
          <EditIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={closeMenu}>
          {Object.entries(rightsLabel).map(([rightKey, rightLabel]) => {
            const hasPermission = agent.permissions && agent.permissions.includes(rightKey);
            return (
              <MenuItem
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
                <ListItemText primary={rightLabel} />
              </MenuItem>
            );
          })}
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default AgentItem;
