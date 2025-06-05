import React, { useEffect, useState } from 'react';
import { useGetList, useTranslate } from 'react-admin';
import { TextField, List, ListItem, ListItemAvatar, ListItemText, Avatar, makeStyles } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import PersonIcon from '@mui/icons-material/Person';
import { USER_AGENT, ACL_READ } from '../../constants';

const useStyles = makeStyles(() => ({
  list: {
    padding: 0,
    width: '100%'
  },
  option: {
    padding: 0
  }
}));

const AddPermissionsForm = ({ agents, addPermission }: any) => {
  const classes = useStyles();
  const translate = useTranslate();
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([] as any[]);

  const { data } = useGetList(
    'Person',
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'pair:label', order: 'ASC' },
      filter: { q: inputValue }
    },
    {
      enabled: inputValue.length > 0
    }
  );

  useEffect(() => {
    setOptions((data?.length || 0) > 0 ? Object.values(data || []) : []);
  }, [data]);

  return (
    <Autocomplete
      classes={{ option: classes.option }}
      getOptionLabel={option => option['pair:label']}
      // Do not return agents which have already been added
      filterOptions={x => x.filter(agent => !Object.keys(agents).includes(agent.id))}
      options={options}
      noOptionsText={translate('ra.navigation.no_results')}
      autoComplete
      blurOnSelect
      clearOnBlur
      disableClearable
      value={value || undefined}
      onChange={(event, record) => {
        addPermission(record.id || record['@id'], USER_AGENT, ACL_READ);
        setValue(null);
        setInputValue('');
        setOptions([]);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={params => (
        <TextField {...params} label={translate('auth.input.agent_select')} variant="filled" margin="dense" fullWidth />
      )}
      renderOption={(props, option) => (
        // @ts-expect-error TS(2769)
        <List dense className={classes.list} {...props}>
          {/* @ts-expect-error TS(2769) */}
          <ListItem button>
            <ListItemAvatar>
              <Avatar src={option.image}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={option['pair:label']} />
          </ListItem>
        </List>
      )}
    />
  );
};

export default AddPermissionsForm;
