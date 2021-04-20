import React, { useEffect, useState } from 'react';
import { useGetList, useTranslate } from 'react-admin';
import { TextField, makeStyles, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PersonIcon from '@material-ui/icons/Person';
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

const AddPermissionsForm = ({ agents, addPermission }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  const { ids, data } = useGetList(
    'Person',
    { page: 1, perPage: 100 },
    { field: 'pair:label', order: 'ASC' },
    { q: inputValue },
    { enabled: inputValue.length > 0 }
  );

  useEffect(() => {
    setOptions(ids.length > 0 ? Object.values(data) : []);
  }, [ids, data]);

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
      value={value}
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
        <TextField
          {...params}
          label={translate('auth.input.agent_select')}
          variant="filled"
          margin="dense"
          fullWidth
        />
      )}
      renderOption={option => (
        <List dense className={classes.list}>
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
