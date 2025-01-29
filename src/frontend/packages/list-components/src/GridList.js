import * as React from 'react';
import { useListContext, useCreatePath, Link, RecordContextProvider } from 'react-admin';
import { Grid } from '@mui/material';
import { useGetExternalLink } from '@semapps/semantic-data-provider';

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const handleClick = () => {};

const GridList = ({ children, linkType = 'edit', externalLinks = false, spacing = 3, xs = 6, sm, md, lg, xl }) => {
  const { data, resource, isLoading } = useListContext();
  const getExternalLink = useGetExternalLink(externalLinks);
  const createPath = useCreatePath();
  if (isLoading || !data) return null;
  return (
    <Grid container spacing={spacing}>
      {data.map(record => {
        if (!record || record._error) return null;
        const externalLink = getExternalLink(record);
        let child;

        if (externalLink) {
          child = (
            <a href={externalLink} target="_blank" rel="noopener noreferrer" onClick={stopPropagation}>
              {React.cloneElement(React.Children.only(children), {
                externalLink: true,
                // Workaround to force ChipField to be clickable
                onClick: handleClick
              })}
            </a>
          );
        } else if (linkType) {
          child = (
            <Link to={createPath({ resource, id: record.id, type: linkType })} onClick={stopPropagation}>
              {React.cloneElement(React.Children.only(children), {
                // Workaround to force ChipField to be clickable
                onClick: handleClick
              })}
            </Link>
          );
        } else {
          child = children;
        }

        return (
          <Grid item key={record.id} xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
            <RecordContextProvider value={record}>{child}</RecordContextProvider>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default GridList;
