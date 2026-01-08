import urlJoin from 'url-join';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const capitalize = (s: any) => (s && s[0].toUpperCase() + s.slice(1)) || '';

const fetchESCO =
  (apiUrl = 'https://ec.europa.eu/esco/api', type = 'skill') =>
  async ({
    keyword,
    locale
  }: any) => {
    const response = await fetch(
      urlJoin(
        apiUrl,
        `suggest2?text=${encodeURIComponent(
          keyword
        )}&language=${locale}&type=${type}&isInScheme=&facet=&offset=&limit=&full=&selectedVersion=&viewObsolete=`
      )
    );
    if (response.ok) {
      const json = await response.json();
      return json._embedded.results.map((r: any) => ({
        uri: r.uri,
        label: capitalize(r.title.replace('’', "'")),
        icon: StarBorderIcon
      }));
    }
    throw new Error('Failed to fetch ESCO server');
  };

export default fetchESCO;
