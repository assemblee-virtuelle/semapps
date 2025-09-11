import { useMemo } from 'react';
import { useGetList } from 'react-admin';
import { useDataModel } from '@semapps/semantic-data-provider';
import renderMentions from './renderMentions';

const useMentions = (userResource: any) => {
  const userDataModel = useDataModel(userResource);

  const { data } = useGetList(
    userResource,
    {
      filter: {
        _predicates: [userDataModel?.fieldsMapping?.title],
        blankNodes: []
      }
    },
    {
      enabled: !!userDataModel?.fieldsMapping?.title
    }
  );

  const availableMentions = useMemo(() => {
    if (data) {
      return data.map(item => ({ id: item.id, label: item[userDataModel?.fieldsMapping?.title || ''] }));
    }
  }, [data]);

  const items = useMemo(() => {
    if (availableMentions) {
      return ({ query }: any) => {
        return availableMentions.filter(({ label }) => label.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5);
      };
    }
  }, [availableMentions]);

  return {
    items,
    render: renderMentions
  };
};

export default useMentions;
