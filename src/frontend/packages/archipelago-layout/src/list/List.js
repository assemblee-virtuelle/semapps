import React from 'react';
import { List as RaList, Pagination as RaPagination } from 'react-admin';
import ListActions from './ListActions';
import { makeStyles } from '@material-ui/core';

const Pagination = props => <RaPagination rowsPerPageOptions={[25, 50, 100]} {...props} />;

const useStyles = makeStyles(() => ({
  content: {
    padding: 20,
    paddingTop: 15
  }
}));

const List = ({ children, ...otherProps }) => {
  const classes = useStyles();
  return (
    <RaList
      actions={<ListActions />}
      sort={{ field: 'pair:label', order: 'DESC' }}
      pagination={<Pagination />}
      perPage={50}
      classes={{ content: classes.content }}
      {...otherProps}
    >
      <>
        {children}
      </>
    </RaList>
  );
}

export default List;
