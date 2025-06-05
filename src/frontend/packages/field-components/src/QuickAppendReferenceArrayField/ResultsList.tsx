import React, { useEffect, useMemo, useState } from 'react';
import {
  useDataProvider,
  useRecordContext,
  useCreatePath,
  useGetResourceLabel,
  useResourceDefinition,
  useTranslate
} from 'react-admin';
import debounce from 'lodash.debounce';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  CircularProgress,
  makeStyles
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ErrorIcon from '@mui/icons-material/Error';
import { useDataServers, useDataModel } from '@semapps/semantic-data-provider';

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingTop: 0,
    paddingBottom: 0
  },
  primaryText: {
    width: '30%'
  },
  secondaryText: {
    fontStyle: 'italic',
    color: 'grey'
  }
}));

const getServerName = (resourceUri: any, dataServers: any) => {
  // @ts-expect-error TS(2571): Object is of type 'unknown'.
  const server = dataServers && Object.values(dataServers).find(server => resourceUri.startsWith(server.baseUrl));
  return server ? server.name : 'Inconnu';
};

const ResultsList = ({ keyword, source, reference, appendLink, switchToCreate }: any) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [results, setResults] = useState([]);
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const dataServers = useDataServers();
  const record = useRecordContext();
  const createPath = useCreatePath();

  const referenceDefinition = useResourceDefinition({ resource: reference });
  const getResourceLabel = useGetResourceLabel();
  const dataModel = useDataModel(reference);

  if (dataModel && Object.keys(dataModel).length > 0 && !dataModel?.fieldsMapping?.title) {
    throw new Error(`No fieldsMapping.title config found for ${reference} dataModel`);
  }

  const search = useMemo(
    () =>
      debounce((keyword: any) => {
        dataProvider
          .getList(reference, {
            pagination: { page: 1, perPage: 100 },
            // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
            sort: { field: dataModel?.fieldsMapping?.title, order: 'ASC' },
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            filter: { q: keyword, _predicates: [dataModel.fieldsMapping.title], _servers: '@all' }
          })
          .then(({ data }) => {
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            const existingLinks = record[source]
              ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                Array.isArray(record[source])
                ? // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  record[source]
                : // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  [record[source]]
              : [];
            const newLinks = data.filter(record => !existingLinks.includes(record.id));
            // @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
            setResults(newLinks);
            setLoaded(true);
            setLoading(false);
          })
          .catch(e => {
            setLoading(false);
          });
      }, 700),
    [dataProvider, dataModel, record, source, reference, setResults, setLoading, setLoaded]
  );

  useEffect(() => {
    if (!keyword) {
      return undefined;
    }
    setLoading(true);
    setLoaded(false);
    search(keyword);

    return () => search.cancel();
  }, [keyword, search, setLoading]);

  if (!keyword) return null;

  return (
    <List dense className={classes.root}>
      {loaded &&
        results.map(resource => (
          // @ts-expect-error TS(2769): No overload matches this call.
          <ListItem key={resource.id} button onClick={() => appendLink(resource.id)}>
            <ListItemAvatar>
              <Avatar>{React.createElement(referenceDefinition.icon)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              className={classes.primaryText}
              // @ts-expect-error TS(2532): Object is possibly 'undefined'.
              primary={resource[dataModel.fieldsMapping.title]}
            />

            <ListItemText
              className={classes.secondaryText}
              // @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
              primary={getServerName(resource.id, dataServers)}
            />
            <ListItemSecondaryAction>
              <a
                // @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
                href={createPath({ resource: reference, id: resource.id, type: 'show' })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton edge="end" size="large">
                  <VisibilityIcon />
                </IconButton>
              </a>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      {loaded && results.length === 0 && (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <ErrorIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText className={classes.primaryText} primary={translate('ra.navigation.no_results')} />
        </ListItem>
      )}
      {loaded && referenceDefinition.hasCreate && (
        // @ts-expect-error TS(2769): No overload matches this call.
        <ListItem button onClick={switchToCreate}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            className={classes.primaryText}
            primary={translate('ra.page.create', { name: getResourceLabel(reference, 1) })}
          />
        </ListItem>
      )}
      {loading && (
        <Box display="flex" alignItems="center" justifyContent="center" height={150}>
          <CircularProgress size={60} thickness={6} />
        </Box>
      )}
    </List>
  );
};

export default ResultsList;
