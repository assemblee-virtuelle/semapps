// in src/customRoutes.js
import * as React from "react";
import { Route } from 'react-router-dom';
import LoggingOut from './LoggingOut';

export default [
    <Route exact path="/loggingout" component={LoggingOut} />,
];
