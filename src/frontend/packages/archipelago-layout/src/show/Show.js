import React from 'react';
import { Show as RaShow } from 'react-admin';
import ShowActions from './ShowActions';

const Show = props => <RaShow actions={<ShowActions />} {...props} />;

export default Show;
