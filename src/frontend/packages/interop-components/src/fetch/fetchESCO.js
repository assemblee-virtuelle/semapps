import urlJoin from 'url-join';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const capitalize = s => (s && s[0].toUpperCase() + s.slice(1)) || '';

const fetchESCO = (apiUrl = 'https://ec.europa.eu/esco/api') => async ({ keyword, locale }) => {
  const response = await fetch(
    urlJoin(
      apiUrl,
      `suggest2?text=${encodeURIComponent(
        keyword
      )}&language=${locale}&type=skill&isInScheme=&facet=&offset=&limit=&full=&selectedVersion=&viewObsolete=`
    )
  );
  if (response.ok) {
    const json = await response.json();
    return json._embedded.results.map(r => ({
      uri: r.uri,
      label: capitalize(r.title.replace('’', "'")),
      icon: StarBorderIcon
    }));
  } else {
    throw new Error('Failed to fetch ESCO server');
  }
};

export default fetchESCO;
