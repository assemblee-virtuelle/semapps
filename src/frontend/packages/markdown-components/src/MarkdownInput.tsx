/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
import { useState, FunctionComponent } from 'react';
import ReactMde, { ReactMdeProps } from 'react-mde';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import { useInput, InputHelperText, useTranslateLabel, TextInputProps } from 'react-admin';
import { FormControl, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& > fieldset': {
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 0,
    borderRadius: theme.shape.borderRadius,
    margin: 1
  },

  '& > fieldset:hover': {
    borderColor: theme.palette.text.primary
  },

  '& > fieldset:focus-within': {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
    marginLeft: 0
  },

  '& > fieldset > legend': {
    color: theme.palette.text.secondary,
    marginLeft: 10,
    fontSize: theme.typography.caption.fontSize
  },

  '& > fieldset:focus-within > legend': {
    color: theme.palette.primary.main
  },

  '& .react-mde': {
    borderWidth: 0,
    borderRadius: theme.shape.borderRadius,
    marginTop: -5
  },

  '& .mde-header': {
    background: 'transparent'
  },

  '& .mde-text:focus': {
    outline: 'none'
  },

  '& .mde-text:focus::placeholder': {
    color: 'transparent'
  },

  '&.empty': {
    '& > fieldset': {
      paddingTop: 10,
      marginTop: 9
    },
    '& > fieldset:focus-within': {
      paddingTop: 0,
      margin: 0,
      marginTop: 1
    },
    '& > fieldset > legend': {
      display: 'none'
    },
    '& > fieldset:focus-within > legend': {
      display: 'block'
    }
  },

  '&.validationError': {
    '& > fieldset': {
      borderColor: theme.palette.error.main
    },
    '& > fieldset > legend, & .mde-text::placeholder': {
      color: theme.palette.error.main
    },
    '& .mde-text:focus::placeholder': {
      color: 'transparent'
    },
    '& p.MuiFormHelperText-root': {
      color: theme.palette.error.main
    }
  }
}));

type Props = TextInputProps & {
  overrides?: MarkdownToJSX.Overrides;
  reactMdeProps?: ReactMdeProps;
};

const MarkdownInput: FunctionComponent<Props> = props => {
  const { label, source, helperText, fullWidth, validate, overrides, reactMdeProps } = props;
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const {
    field: { value, onChange },
    fieldState: { isDirty, invalid, error, isTouched },
    formState: { isSubmitted },
    isRequired
  } = useInput({ source, validate });

  const translateLabel = useTranslateLabel();
  const translatedLabel = `${translateLabel({ label, source })}${isRequired ? '*' : ''}`;

  return (
    <StyledFormControl
      fullWidth={fullWidth}
      className={`${invalid ? 'validationError' : ''} ${value === '' ? 'empty' : ''}`}
    >
      <fieldset>
        <legend>{translatedLabel}</legend>
        <ReactMde
          value={value}
          onChange={val => onChange(val)}
          onTabChange={newTab => setTab(newTab)}
          /* eslint-disable-next-line react/no-unstable-nested-components */
          generateMarkdownPreview={async markdown => (
            <Markdown
              options={{
                overrides: overrides || {}
              }}
            >
              {markdown}
            </Markdown>
          )}
          selectedTab={tab}
          childProps={{ textArea: { placeholder: translatedLabel } }}
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...reactMdeProps}
        />
      </fieldset>
      <FormHelperText error={isDirty && invalid} margin="dense" variant="outlined">
        <InputHelperText
          error={error?.message}
          helperText={helperText}
          // @ts-expect-error TS(2322): Type '{ error: string | undefined; helperText: str... Remove this comment to see the full error message
          touched={isTouched || isSubmitted}
        />
      </FormHelperText>
    </StyledFormControl>
  );
};

export default MarkdownInput;
