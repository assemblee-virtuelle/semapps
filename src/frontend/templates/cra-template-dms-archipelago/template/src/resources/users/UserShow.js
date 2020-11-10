import React from 'react';
import { ChipField, SingleFieldList, TextField } from 'react-admin';
import { Column, ColumnShowLayout, Hero, Show, GridList } from '@semapps/archipelago-layout';
import { UriArrayField } from '@semapps/semantic-data-provider';
import { Typography, Box, makeStyles } from '@material-ui/core';

const UserTitle = ({ record }) => {
  return <span>{record ? `${record['foaf:name']} ${record['foaf:familyName']}` : ''}</span>;
};

const useStyles = makeStyles(() => ({
  parent: {
    position: 'relative'
  },
  child: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6
  },
  caption: {
    color: 'black',
    fontSize: 13
  }
}));

const UserIcon = ({ record }) => {
  const classes = useStyles();
  const fullName = record ? record['foaf:name'] + ' ' + record['foaf:familyName'] : '';
  return (
    <Box className={classes.parent}>
      <img src={process.env.PUBLIC_URL + '/unknown-user.png'} style={{ width: '100%' }} alt={fullName} />
      <Box bgcolor="secondary.main" className={classes.child} borderRadius={7}>
        <Typography align="center" className={classes.caption} noWrap>
          {fullName}
        </Typography>
      </Box>
    </Box>
  );
};

const UserShow = props => (
  <Show {...props}>
    <ColumnShowLayout>
      <Column xs={12} sm={9}>
        <Hero title={<UserTitle />} image={process.env.PUBLIC_URL + '/unknown-user.png'}>
          <TextField label="Prénom" source="foaf:name" />
          <TextField label="Nom de famille" source="foaf:familyName" />
        </Hero>
      </Column>
      <Column xs={12} sm={3} showLabel>
        <UriArrayField label="Connait" reference="User" source="foaf:knows" referenceBasePath="/User">
          <GridList xs={6} linkType="show">
            <UserIcon />
          </GridList>
        </UriArrayField>
      </Column>
    </ColumnShowLayout>
  </Show>
);

export default UserShow;
