import React, { useState, useLayoutEffect } from 'react';
import { Create as RaCreate } from 'react-admin';
import CreateActions from './CreateActions';

const Create = ({ actions, ...rest }) => {
  // Since the page title is inside the Toolbar component,
  // trigger a rerender so that the React portal can select it
  const [ _, setTitleRendered ] = useState(false);
  useLayoutEffect(() => {
    setTitleRendered(true);
  }, [setTitleRendered]);

  return <RaCreate actions={React.cloneElement(actions, rest)} redirect="show" {...rest} />;
}

Create.defaultProps = {
  actions: <CreateActions />
};

export default Create;
