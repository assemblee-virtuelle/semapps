import React from 'react';
import { List as RaList, Pagination as RaPagination } from 'react-admin';
import ListActions from './ListActions';

const Pagination = props => <RaPagination rowsPerPageOptions={[25, 50, 100]} {...props} />;

const List = ({ actions, ...otherProps }) => (
  <RaList
    actions={React.cloneElement(actions, otherProps)}
    sort={{ field: 'pair:label', order: 'DESC' }}
    pagination={<Pagination />}
    perPage={50}
    {...otherProps}
  />
);

List.defaultProps = {
  actions: <ListActions />
};

export default List;
