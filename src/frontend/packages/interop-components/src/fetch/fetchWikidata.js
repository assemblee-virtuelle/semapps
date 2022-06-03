import LanguageIcon from '@material-ui/icons/Language';

const capitalize = s => (s && s[0].toUpperCase() + s.slice(1)) || '';

const fetchWikidata = async ({ keyword, locale }) => {
  const response = await fetch(
    `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=${locale}&uselang=${locale}&type=item&limit=10&origin=*&search=${encodeURIComponent(
      keyword
    )}`
  );
  const json = await response.json();
  return json.search.map(r => ({
    uri: r.concepturi,
    label: capitalize(r.match.text),
    summary: capitalize(r.description),
    icon: LanguageIcon
  }));
};

export default fetchWikidata;
