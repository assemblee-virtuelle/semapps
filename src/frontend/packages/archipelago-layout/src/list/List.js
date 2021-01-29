import React from 'react';
import { List as RaList, Pagination as RaPagination } from 'react-admin';
import ListActions from './ListActions';

const Pagination = props => <RaPagination rowsPerPageOptions={[25, 50, 100]} {...props} />;

const List = ({ children, ...otherProps }) => (
  <RaList
    actions={<ListActions />}
    sort={{ field: 'pair:label', order: 'DESC' }}
    pagination={<Pagination />}
    perPage={50}
    {...otherProps}
  >
    {children}
  </RaList>
);

export default List;
