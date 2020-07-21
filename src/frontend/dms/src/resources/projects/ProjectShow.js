import React from 'react';
import { ChipField, Show, SingleFieldList, TextField } from 'react-admin';
import { makeStyles } from '@material-ui/core';
import ColumnShowLayout from '../../components/ColumnShowLayout';
import Column from '../../components/Column';
import Hero from '../../components/Hero';
import MarkDownField from '../../components/MarkdownField';
import JsonLdReferenceArrayField from '../../components/JsonLdReferenceArrayField';

const useStyles = makeStyles(() => ({
  card: {
    padding: 25
  },
  singleFieldList: {
    margin: 0
  }
}));

const ProjectTitle = ({ record }) => {
  return <span>{record ? record.label : ''}</span>;
};

const ProjectShow = props => {
  const classes = useStyles();
  return (
    <Show classes={{ card: classes.card }} {...props}>
      <ColumnShowLayout>
        <Column xs={9}>
          <Hero title={<ProjectTitle />}>
            <TextField label="Adresse" source="adress" />
            <TextField label="Commentaire" source="comment" />
          </Hero>
          <MarkDownField source="description" addLabel />
        </Column>
        <Column xs={3} showLabel>
          <TextField label="Adresse" source="adress" />
          <TextField label="Commentaire" source="comment" />
          <JsonLdReferenceArrayField addLabel label="Participants" reference="Agent" source="involves">
            <SingleFieldList classes={{ root: classes.singleFieldList }} linkType="show">
              <ChipField source="firstName" color="primary" />
            </SingleFieldList>
          </JsonLdReferenceArrayField>
        </Column>
      </ColumnShowLayout>
    </Show>
  );
};

export default ProjectShow;
