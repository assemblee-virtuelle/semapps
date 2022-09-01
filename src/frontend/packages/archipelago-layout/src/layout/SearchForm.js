import React from 'react';
import { getResources } from 'react-admin';
import { Grid, Select, MenuItem, TextField, Button } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import { useHistory, useLocation } from 'react-router-dom';
import { shallowEqual, useSelector, useStore } from 'react-redux';

const FilterText = ({ input, ...otherProps }) => <TextField {...input} {...otherProps} />;

const TypeSelect = ({ input, ...otherProps }) => {
  const resources = useSelector(getResources, shallowEqual);
  return (
    <Select {...input} {...otherProps}>
      {resources
        .filter(resource => resource.hasList || resource.name === input.value)
        .map(resource => (
          <MenuItem value={resource.name} key={resource.name}>
            {resource.options.label}
          </MenuItem>
        ))}
    </Select>
  );
};

const SearchForm = () => {
  const history = useHistory();

  const location = useLocation();
  const matches = location.pathname.match(/^\/([^/]+)/);
  const currentType = matches ? matches[1] : 'Organization';

  const store = useStore();
  const state = store.getState();
  const qFilter = state?.admin?.resources[location.pathname.split('/')[1]]?.list?.params?.filter?.q;

  const onSubmit = ({ filter, type }) => {
    if (filter) {
      history.push(`/${type}?filter=${encodeURIComponent(`{"q": "${filter}"}`)}`);
    } else {
      history.push(`/${type}?filter=${encodeURIComponent(`{}`)}`);
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ type: currentType, filter: qFilter ? qFilter : '' }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <Field name="filter" component={FilterText} placeholder="Rechercher..." fullWidth />
            </Grid>
            <Grid item xs={5}>
              <Field name="type" component={TypeSelect} fullWidth />
            </Grid>
            <Grid item xs={2}>
              <Button variant="outlined" type="submit" fullWidth>
                Hop
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    />
  );
};

export default SearchForm;
