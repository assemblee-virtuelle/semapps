import LanguageIcon from '@mui/icons-material/Language';

const capitalize = (s: any) => (s && s[0].toUpperCase() + s.slice(1)) || '';

const fetchWikidata =
  (apiUrl = 'https://www.wikidata.org/w/api.php') =>
  async ({
    keyword,
    locale
  }: any) => {
    const response = await fetch(
      `${apiUrl}?action=wbsearchentities&format=json&language=${locale}&uselang=${locale}&type=item&limit=10&origin=*&search=${encodeURIComponent(
        keyword
      )}`
    );
    if (response.ok) {
      const json = await response.json();
      return json.search.map((r: any) => ({
        uri: r.concepturi,
        label: capitalize(r.match.text),
        summary: capitalize(r.description),
        icon: LanguageIcon
      }));
    }
    throw new Error('Failed to fetch Wikidata server');
  };

export default fetchWikidata;
