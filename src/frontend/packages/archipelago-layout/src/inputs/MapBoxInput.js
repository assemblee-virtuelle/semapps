import React, { useState, useMemo, useEffect } from 'react';
import { FieldTitle, useInput, useTranslate, useLocale } from 'react-admin';
import { TextField, Typography, Grid, makeStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { default as highlightMatch } from 'autosuggest-highlight/match';
import { default as highlightParse } from 'autosuggest-highlight/parse';
import throttle from 'lodash.throttle';

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  }
}));

const selectOptionText = (option, optionText) => {
  if (option.place_name) {
    return option.place_name;
  } else if (typeof optionText === 'string') {
    return option[optionText];
  } else if (typeof optionText === 'function') {
    return optionText(option);
  }
};

const MapBoxInput = ({ config, record, resource, source, label, basePath, parse, optionText, ...rest }) => {
  const classes = useStyles();
  const locale = useLocale();
  const translate = useTranslate();

  const [keyword, setKeyword] = useState(''); // Typed keywords
  const [options, setOptions] = useState([]); // Options returned by MapBox

  // Do not pass the `parse` prop to useInput, as we manually call it on the onChange prop below
  const {
    input: { value, onChange },
    isRequired
  } = useInput({ resource, source, ...rest });

  const fetchMapbox = useMemo(
    () =>
      throttle((keyword, callback) => {
        const fetchUrl = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${keyword}.json`);

        // Use locale as default language
        if (!config.language) config.language = locale;

        // All options available at https://docs.mapbox.com/api/search/geocoding/#forward-geocoding
        Object.entries(config).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value = value.join(',');
          } else if (typeof value === 'boolean') {
            value = value ? 'true' : 'false';
          }
          fetchUrl.searchParams.set(key, value);
        });

        fetch(fetchUrl.toString())
          .then(res => res.json())
          .then(json => callback(json));
      }, 200),
    [config, locale]
  );

  useEffect(() => {
    // Do not trigger search if text input is empty or if it is the same as the current value
    if (!keyword || keyword === selectOptionText(value, optionText)) {
      return undefined;
    } else {
      fetchMapbox(keyword, results => setOptions(results.features));
    }
  }, [value, keyword, fetchMapbox]);

  return (
    <Autocomplete
      autoComplete
      value={value || null}
      // We must include the current value as an option, to avoid this error
      // https://github.com/mui-org/material-ui/issues/18514#issuecomment-636096386
      options={value ? [value, ...options] : options}
      // Do not show the current value as an option (this would break renderOptions)
      filterSelectedOptions
      // For some reasons, this prop has to be passed
      filterOptions={x => x}
      getOptionLabel={option => selectOptionText(option, optionText)}
      getOptionSelected={(option, value) =>
        selectOptionText(option, optionText) === selectOptionText(value, optionText)
      }
      // This function is called when the user selects an option
      onChange={(event, newValue) => {
        // Parse only if the value is not null (happens if the user clears the value)
        if (newValue) newValue = parse(newValue);
        onChange(newValue);
        setOptions([]);
      }}
      onInputChange={(event, newKeyword) => setKeyword(newKeyword)}
      noOptionsText={translate('ra.navigation.no_results')}
      renderInput={params => {
        return (
          <TextField
            {...params}
            label={
              label !== '' &&
              label !== false && (
                <FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />
              )
            }
            {...rest}
          />
        );
      }}
      renderOption={option => {
        const matches = highlightMatch(option.text, keyword);
        const parts = highlightParse(option.text, matches);

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              {typeof parts === 'string'
                ? parts
                : parts.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                      {part.text}
                    </span>
                  ))}
              <Typography variant="body2" color="textSecondary">
                {option.place_name}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

MapBoxInput.defaultProps = {
  variant: 'filled',
  margin: 'dense'
};

export default MapBoxInput;
