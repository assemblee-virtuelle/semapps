import { useDataProvider, useTranslate } from 'react-admin';

const useLoadLinks = (resourceType, labelProp) => {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  return async keyword => {
    if (keyword) {
      const results = await dataProvider.getList(resourceType, {
        pagination: {
          page: 1,
          perPage: 5
        },
        filter: { q: keyword }
      });
      if (results.total > 0) {
        return results.data.map(record => ({
          preview: record[labelProp],
          value: `[${record[labelProp]}](/${resourceType}/${encodeURIComponent(record.id)}/show)`
        }));
      }
      return [{ preview: translate('ra.navigation.no_results'), value: `[${keyword}` }];
    }
    return [{ preview: translate('ra.action.search'), value: `[${keyword}` }];
  };
};

export default useLoadLinks;
