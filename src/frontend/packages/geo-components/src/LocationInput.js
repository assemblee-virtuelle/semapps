import React, { useState, useMemo, useEffect } from 'react';
import {
  FieldTitle,
  InputHelperText,
  useInput,
  useTranslate,
  useLocale,
  useRecordContext,
  useResourceContext,
  useTheme
} from 'react-admin';
import { TextField, Typography, Grid } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { default as highlightMatch } from 'autosuggest-highlight/match';
import { default as highlightParse } from 'autosuggest-highlight/parse';
import throttle from 'lodash.throttle';
import { styled } from '@mui/system';

const StyledLocationOnIcon = styled(LocationOnIcon)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginRight: theme.spacing(2)
}));

const selectOptionText = (option, optionText) => {
  if (option.place_name) {
    return option.place_name;
  }
  if (typeof optionText === 'string') {
    return option[optionText];
  }
  if (typeof optionText === 'function') {
    return optionText(option);
  }
};

const LocationInput = ({
  mapboxConfig,
  source,
  label,
  parse,
  optionText,
  helperText,
  variant = 'outlined',
  size = 'small',
  ...rest
}) => {
  if (!mapboxConfig) {
    throw new Error('@semapps/geo-components : No mapbox configuration');
  }
  if (!mapboxConfig.access_token) {
    throw new Error('@semapps/geo-components : No access token in mapbox configuration');
  }

  const record = useRecordContext();
  const resource = useResourceContext();
  const locale = useLocale();
  const translate = useTranslate();

  const [keyword, setKeyword] = useState(''); // Typed keywords
  const [options, setOptions] = useState([]); // Options returned by MapBox

  // Do not pass the `parse` prop to useInput, as we manually call it on the onChange prop below
  const {
    field: { value, onChange, onBlur /* , onFocus */ },
    isRequired,
    fieldState: { error, /* submitError, */ isTouched }
  } = useInput({ resource, source, ...rest });

  const fetchMapbox = useMemo(
    () =>
      throttle((keyword, callback) => {
        const fetchUrl = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${keyword}.json`);

        // Use locale as default language
        if (!mapboxConfig.language) mapboxConfig.language = locale;

        // All options available at https://docs.mapbox.com/api/search/geocoding/#forward-geocoding
        Object.entries(mapboxConfig).forEach(([key, value]) => {
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
    [mapboxConfig, locale]
  );

  useEffect(() => {
    // Do not trigger search if text input is empty or if it is the same as the current value
    if (!keyword || keyword === selectOptionText(value, optionText)) {
      return undefined;
    }
    fetchMapbox(keyword, results => setOptions(results.features));
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
      isOptionEqualToValue={(option, value) =>
        selectOptionText(option, optionText) === selectOptionText(value, optionText)
      }
      // This function is called when the user selects an option
      onChange={(event, newValue) => {
        // Parse only if the value is not null (happens if the user clears the value)
        if (newValue && parse) newValue = parse(newValue);
        onChange(newValue);
        setOptions([]);
      }}
      onInputChange={(event, newKeyword) => setKeyword(newKeyword)}
      noOptionsText={translate('ra.navigation.no_results')}
      renderInput={params => {
        // Autocomplete=off doesn't work anymore in modern browsers
        // https://stackoverflow.com/a/40791726/7900695
        params.inputProps.autoComplete = 'new-password';
        return (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              onBlur: e => {
                onBlur(e);
                if (params.inputProps.onBlur) {
                  params.inputProps.onBlur(e);
                }
              } /* ,
              onFocus: e => {
                onFocus(e);
                if (params.inputProps.onFocus) {
                  params.inputProps.onFocus(e);
                }
              } */
            }}
            label={
              label !== '' &&
              label !== false && (
                <FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />
              )
            }
            error={!!((isTouched && error) /* || submitError */)}
            helperText={
              <InputHelperText touched={isTouched} error={error /* || submitError */} helperText={helperText} />
            }
            {...rest}
          />
        );
      }}
      renderOption={(props, option, state) => {
        const matches = highlightMatch(option.text, keyword);
        const parts = highlightParse(option.text, matches);

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item>
                <StyledLocationOnIcon />
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
          </li>
        );
      }}
      variant={variant}
      size={size}
      {...rest}
    />
  );
};

export default LocationInput;
