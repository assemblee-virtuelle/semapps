import React from "react";
import { Grid, Select, MenuItem, TextField, Button } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import { useHistory } from 'react-router-dom';

const FilterText = ({ input, ...otherProps }) => (
  <TextField {...input} {...otherProps} />
);

const TypeSelect = ({ input, ...otherProps }) => (
  <Select {...input} {...otherProps}>
    <MenuItem value="Organization">Organisations</MenuItem>
    <MenuItem value="Project">Projets</MenuItem>
    <MenuItem value="User">Personnes</MenuItem>
  </Select>
);

const SearchForm = () => {
  const history = useHistory();

  const onSubmit = ({ filter, type }) => {
    if( filter ) {
      history.push(`/${type}?filter=${encodeURIComponent(`{"q": "${filter}"}`)}`);
    } else {
      history.push(`/${type}`);
    }
  };

  return(
    <Form
      onSubmit={onSubmit}
      initialValues={{ type: 'Organization' }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <Field name="filter" component={FilterText} placeholder="Rechercher..." fullWidth />
            </Grid>
            <Grid item xs={5}>
              <Field name="type" component={TypeSelect} fullWidth />
            </Grid>
            <Grid item xs={2}>
              <Button variant="outlined" type="submit">
                Hop !
              </Button>
            </Grid>
          </Grid>
        </form>
    )}/>
  );
};

export default SearchForm;
