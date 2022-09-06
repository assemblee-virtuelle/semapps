import React from 'react';
import { MenuItemLink } from 'react-admin';
import DefaultIcon from '@material-ui/icons/ViewList';

const ResourceMenuLink = ({ resource, onClick, open }) => (
  <MenuItemLink
    to={`/${resource.name}`}
    primaryText={(resource.options && resource.options.label) || resource.name}
    leftIcon={resource.icon ? <resource.icon /> : <DefaultIcon />}
    onClick={onClick}
    sidebarIsOpen={open}
  />
);

export default ResourceMenuLink;
