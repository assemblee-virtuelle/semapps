import StarBorderIcon from '@material-ui/icons/StarBorder';

const capitalize = s => (s && s[0].toUpperCase() + s.slice(1)) || "";

const fetchESCO = async ({ keyword, locale }) => {
  const response = await fetch(`https://ec.europa.eu/esco/api/suggest2?text=${encodeURIComponent(keyword)}&language=${locale}&type=skill&isInScheme=&facet=&offset=&limit=&full=&selectedVersion=&viewObsolete=`);
  const json = await response.json();
  return json._embedded.results.map(r => ({
    uri: r.uri,
    label: capitalize(r.title),
    icon: StarBorderIcon
  }));
};

export default fetchESCO;
