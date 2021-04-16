import React, { useEffect } from 'react';
import { useGetList } from 'react-admin';
import { TextField, makeStyles, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PersonIcon from '@material-ui/icons/Person';
import { ACL_READ } from '../../constants';

const useStyles = makeStyles(() => ({
  list: {
    padding: 0,
    width: '100%'
  },
  option: {
    padding: 0
  }
}));

const AddPermissionsForm = ({ addPermission }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

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
      filterOptions={x => x}
      options={options}
      noOptionsText="Aucun résultat"
      autoComplete
      blurOnSelect
      clearOnBlur
      disableClearable
      value={value}
      onChange={(event, record) => {
        addPermission(record.id || record['@id'], 'user', ACL_READ);
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
          label="Ajouter un utilisateur ou un groupe..."
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
