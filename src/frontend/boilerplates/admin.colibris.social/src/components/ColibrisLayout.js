import React from 'react';
import { Layout } from 'react-admin';
import ColibrisAppBar from './ColibrisAppBar';

const ColibrisLayout = props => <Layout {...props} appBar={ColibrisAppBar} />;

export default ColibrisLayout;
