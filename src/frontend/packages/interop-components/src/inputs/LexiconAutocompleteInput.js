import React, { useState, useMemo, useEffect } from 'react';
import { FieldTitle, useInput, useTranslate, useLocale, useNotify } from 'react-admin';
import { TextField, Typography, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Autocomplete from '@mui/material/Autocomplete';
import LanguageIcon from '@mui/icons-material/Language';
import AddIcon from '@mui/icons-material/Add';
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
  if (typeof option === 'string') {
    return option;
  } else if (option.label) {
    return option.label;
  } else if (typeof optionText === 'string') {
    return option[optionText];
  } else if (typeof optionText === 'function') {
    return optionText(option);
  }
};

const capitalizeFirstLetter = string => string && (string.charAt(0).toUpperCase() + string.slice(1));

const LexiconAutocompleteInput = ({
  fetchLexicon,
  resource,
  source,
  initialValue,
  label,
  parse,
  optionText,
  helperText,
  ...rest
}) => {
  const classes = useStyles();
  const locale = useLocale();
  const translate = useTranslate();
  const notify = useNotify();

  // Do not pass the `parse` prop to useInput, as we manually call it on the onChange prop below
  const {
    input: { value, onChange, onBlur, onFocus },
    isRequired,
    meta: { error, submitError, touched }
  } = useInput({ source, initialValue, ...rest });

  const [keyword, setKeyword] = useState(initialValue); // Typed keywords
  const [options, setOptions] = useState([]); // Options returned by MapBox

  const throttledFetchLexicon = useMemo(
    () =>
      throttle((keyword, callback) => {
        fetchLexicon({ keyword, locale })
          .then(data => callback(data))
          .catch(e => notify(e.message, 'error'));
      }, 200),
    [locale, fetchLexicon, notify]
  );

  useEffect(() => {
    // Do not trigger search if text input is empty or if it is the same as the current value
    if (!keyword /*|| keyword === selectOptionText(value, optionText)*/) {
      return undefined;
    } else {
      throttledFetchLexicon(keyword, results => setOptions(results));
    }
  }, [value, keyword, optionText, throttledFetchLexicon]);

  return (
    <Autocomplete
      freeSolo
      autoComplete
      value={value || null}
      openOnFocus={!!initialValue}
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
                  params.inputProps.onBlur(e);
                }
              },
              onFocus: e => {
                onFocus(e);
                if (params.inputProps.onFocus) {
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
            error={!!(touched && (error || submitError))}
            // helperText={<InputHelperText touched={touched} error={error || submitError} helperText={helperText} />}
            {...rest}
          />
        );
      }}
      renderOption={option => {
        const matches = highlightMatch(option.label, keyword);
        const parts = highlightParse(option.label, matches);

        return (
          <Grid container alignItems="center">
            <Grid item>{React.createElement(option.icon || LanguageIcon, { className: classes.icon })}</Grid>
            <Grid item xs>
              {typeof parts === 'string'
                ? parts
                : parts.map((part, index) => (
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
};

LexiconAutocompleteInput.defaultProps = {
  variant: 'filled',
  margin: 'dense'
};

export default LexiconAutocompleteInput;
