import React from 'react';
import { getResources } from 'react-admin';
import { Grid, Select, MenuItem, TextField, Button } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import { useHistory, useLocation } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';

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

  const onSubmit = ({ filter, type }) => {
    if (filter) {
      history.push(`/${type}?filter=${encodeURIComponent(`{"q": "${filter}"}`)}`);
    } else {
      history.push(`/${type}`);
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ type: currentType }}
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
