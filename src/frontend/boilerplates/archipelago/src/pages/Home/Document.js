import * as React from "react";
import { useQueryWithStore, Loading, Error, Link } from 'react-admin';
import { MarkdownField } from "@semapps/archipelago-layout";
import FooterInfo from "./FooterInfo";

const Document = ({ id }) => {
  const uri = process.env.REACT_APP_MIDDLEWARE_URL + 'documents/' + id;

  const { loaded, error, data } = useQueryWithStore({
    type: 'getOne',
    resource: 'Document',
    payload: { id: uri }
  });

  if (!loaded) return <Loading/>;
  if (error) return <Error/>;

  return (
    <>
      <h1 style={{ marginTop: 0 }}>{data ? data['pair:label'] : ''}</h1>
      <MarkdownField record={data} resource="Document" source="pair:description" />
      <FooterInfo>
        Dernière modification le 23 décembre 2020
        <Link to={'/Document/'+encodeURIComponent(uri)+'/show'}>Voir</Link>
        <Link to={'/Document/'+encodeURIComponent(uri)+'/edit'}>Editer</Link>
      </FooterInfo>
    </>
  );
};

export default Document;