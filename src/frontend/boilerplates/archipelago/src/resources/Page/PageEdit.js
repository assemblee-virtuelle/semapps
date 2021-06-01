import React from 'react';
import { SimpleForm, TextInput } from 'react-admin';
import { EditWithPermissions } from '@semapps/auth-provider';
import { MarkdownInput, useLoadLinks } from '@semapps/markdown-components';
import PageTitle from './PageTitle';

export const PageEdit = props => {
  const loadLinks = useLoadLinks('Page', 'semapps:title');
  return (
    <EditWithPermissions title={<PageTitle />} {...props}>
      <SimpleForm redirect="show">
        <TextInput source="semapps:title" fullWidth />
        <MarkdownInput source="semapps:content" loadSuggestions={loadLinks} suggestionTriggerCharacters="[" fullWidth />
      </SimpleForm>
    </EditWithPermissions>
  );
};

export default PageEdit;
