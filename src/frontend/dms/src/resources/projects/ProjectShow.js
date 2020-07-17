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
  return <span>{record ? record['pairv1:preferedLabel'] : ''}</span>;
};

const ProjectShow = props => {
  const classes = useStyles();
  return (
    <Show classes={{ card: classes.card }} {...props}>
      <ColumnShowLayout>
        <Column xs={9}>
          <Hero title={<ProjectTitle />}>
            <TextField label="Adresse" source="pairv1:adress" />
            <TextField label="Commentaire" source="pairv1:comment" />
            <TextField label="Adresse" source="pairv1:adress" />
          </Hero>
          <MarkDownField source="pairv1:description" addLabel />
        </Column>
        <Column xs={3} showLabel>
          <TextField label="Adresse" source="pairv1:adress" />
          <TextField label="Commentaire" source="pairv1:comment" />
          <JsonLdReferenceArrayField addLabel label="Les Partenaires" reference="Agent" source="pairv1:isManagedBy">
            <SingleFieldList classes={{ root: classes.singleFieldList }} linkType="show">
              <ChipField source="pairv1:preferedLabel" color="primary" />
            </SingleFieldList>
          </JsonLdReferenceArrayField>
        </Column>
      </ColumnShowLayout>
    </Show>
  );
};

export default ProjectShow;
