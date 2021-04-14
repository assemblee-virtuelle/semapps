import React, { useState, useEffect } from 'react';
import { useDataProvider, Loading, Error } from 'react-admin';
import { makeStyles, Avatar, ListItem, ListItemIcon, ListItemAvatar, ListItemText, ListItemSecondaryAction, IconButton, Menu, MenuItem } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import { rightsLabel } from "../constants";

const useStyles = makeStyles(() => ({
  listItem: {
    paddingLeft: 4,
    paddingRight: 36
  },
  secondaryText: {
    textAlign: "center",
    width: '50%',
    fontStyle: "italic",
    color: "grey"
  }
}));

const AgentItem = ({ agent }) => {
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    if( agent.type === 'user' ) {
      dataProvider.getOne('Person', { id: agent.id })
        .then(({ data }) => {
          setUser(data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        })
    } else {
      setLoading(false);
    }
  }, [agent.id, agent.type]);

  // For now, do not display groups
  if( agent.type === 'group' ) return null;

  const openMenu = event => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null)

  if (loading) return <Loading />;
  if (error) return <Error />;

  return(
    <ListItem button className={classes.listItem}>
      <ListItemAvatar>
        <Avatar src={user?.image}>
          {agent.icon}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={agent.label || user?.name} />
      <ListItemText
        className={classes.secondaryText}
        primary={agent.permissions && agent.permissions.map(p => rightsLabel[p]).join(', ')}
      />
      <ListItemSecondaryAction>
        <IconButton onClick={openMenu}>
          <EditIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={closeMenu}
        >
          {Object.entries(rightsLabel).map(([rightKey, rightLabel]) => (
            <MenuItem onClick={closeMenu}>
              <ListItemIcon>{agent.permissions && agent.permissions.includes(rightKey) ? <CheckIcon /> : null}</ListItemIcon>
              <ListItemText primary={rightLabel} />
            </MenuItem>
          ))}
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default AgentItem;
