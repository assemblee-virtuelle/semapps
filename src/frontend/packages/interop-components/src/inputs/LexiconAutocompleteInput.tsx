import React, { useState, useMemo, useEffect, forwardRef } from 'react';
import {
  FieldTitle,
  useInput,
  useTranslate,
  useLocale,
  useNotify,
  useResourceContext,
  InputHelperText
} from 'react-admin';
import { TextField, Typography, Grid } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import Autocomplete from '@mui/material/Autocomplete';
import LanguageIcon from '@mui/icons-material/Language';
import AddIcon from '@mui/icons-material/Add';
import { default as highlightMatch } from 'autosuggest-highlight/match';
import { default as highlightParse } from 'autosuggest-highlight/parse';
import throttle from 'lodash.throttle';

const useStyles = makeStyles()(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  }
}));

const selectOptionText = (option: any, optionText: any) => {
  if (typeof option === 'string') {
    return option;
  }
  if (option.label) {
    return option.label;
  }
  if (typeof optionText === 'string') {
    return option[optionText];
  }
  if (typeof optionText === 'function') {
    return optionText(option);
  }
};

const capitalizeFirstLetter = (string: any) => string && string.charAt(0).toUpperCase() + string.slice(1);

const LexiconAutocompleteInput = forwardRef(
  // @ts-expect-error TS(2339): Property 'fetchLexicon' does not exist on type '{}... Remove this comment to see the full error message
  ({ fetchLexicon, source, defaultValue, label, parse, optionText = 'label', helperText, ...rest }, ref) => {
    const resource = useResourceContext();
    const { classes } = useStyles();
    const locale = useLocale();
    const translate = useTranslate();
    const notify = useNotify();

    // Do not pass the `parse` prop to useInput, as we manually call it on the onChange prop below
    const {
      field: { value, onChange, onBlur },
      fieldState: { isTouched, error },
      // @ts-expect-error TS(2339): Property 'submitError' does not exist on type 'Use... Remove this comment to see the full error message
      formState: { submitError },
      isRequired
    } = useInput({ source, defaultValue, ...rest });

    const [keyword, setKeyword] = useState(defaultValue); // Typed keywords
    const [options, setOptions] = useState([]); // Options returned by MapBox

    const throttledFetchLexicon = useMemo(
      () =>
        throttle((keyword: any, callback: any) => {
          fetchLexicon({ keyword, locale })
            .then((data: any) => callback(data))
            .catch((e: any) => notify(e.message, { type: 'error' }));
        }, 200),
      [locale, fetchLexicon, notify]
    );

    useEffect(() => {
      // Do not trigger search if text input is empty
      if (!keyword) {
        return undefined;
      }
      throttledFetchLexicon(keyword, (results: any) => setOptions(results));
    }, [value, keyword, throttledFetchLexicon]);

    return (
      <Autocomplete
        fullWidth
        freeSolo
        autoComplete
        value={value || null}
        ref={ref}
        openOnFocus={!!defaultValue}
        // We must include the current value as an option, to avoid this error
        // https://github.com/mui-org/material-ui/issues/18514#issuecomment-636096386
        options={value ? [value, ...options] : options}
        // Do not show the current value as an option (this would break renderOptions)
        filterSelectedOptions
        // For some reasons, this prop has to be passed
        filterOptions={(options, params) => {
          // Suggest the creation of a new value
          if (keyword) {
            options.push({
              label: capitalizeFirstLetter(keyword),
              summary: `Ajouter "${capitalizeFirstLetter(keyword)}" au dictionnaire`,
              icon: AddIcon
            });
          }
          return options;
        }}
        clearOnBlur // Recommended for https://v4.mui.com/components/autocomplete/#creatable
        selectOnFocus // Recommended for https://v4.mui.com/components/autocomplete/#creatable
        handleHomeEndKeys // Recommended for https://v4.mui.com/components/autocomplete/#creatable
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
              autoFocus
              inputProps={{
                ...params.inputProps,
                onBlur: e => {
                  onBlur(e);
                  if (params.inputProps.onBlur) {
                    // @ts-expect-error TS(2345): Argument of type 'FocusEvent<HTMLInputElement | HT... Remove this comment to see the full error message
                    params.inputProps.onBlur(e);
                  }
                },
                onFocus: e => {
                  if (params.inputProps.onFocus) {
                    // @ts-expect-error TS(2345): Argument of type 'FocusEvent<HTMLInputElement | HT... Remove this comment to see the full error message
                    params.inputProps.onFocus(e);
                  }
                }
              }}
              label={
                label !== '' &&
                label !== false && (
                  <FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />
                )
              }
              error={!!(isTouched && (error || submitError))}
              // @ts-expect-error TS(2322): Type '{ touched: boolean; error: any; helperText: ... Remove this comment to see the full error message
              helperText={<InputHelperText touched={isTouched} error={error || submitError} helperText={helperText} />}
            />
          );
        }}
        renderOption={(props, option) => {
          const matches = highlightMatch(option.label, keyword);
          const parts = highlightParse(option.label, matches);
          return (
            <Grid container alignItems="center" {...props} key={option.uri || 'create'}>
              <Grid item>{React.createElement(option.icon || LanguageIcon, { className: classes.icon })}</Grid>
              <Grid item xs>
                {typeof parts === 'string'
                  ? parts
                  : parts.map((part: any, index: any) => (
                      <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                        {part.text}
                      </span>
                    ))}
                <Typography variant="body2" color="textSecondary">
                  {option.summary}
                </Typography>
              </Grid>
            </Grid>
          );
        }}
      />
    );
  }
);

export default LexiconAutocompleteInput;
