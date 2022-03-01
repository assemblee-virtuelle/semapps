import React from 'react';
import { Show as RaShow } from 'react-admin';
import ShowActions from './ShowActions';

const Show = ({ actions, ...rest }) => <RaShow actions={React.cloneElement(actions, rest)} {...rest} />;

Show.defaultProps = {
  actions: <ShowActions />
};

export default Show;
