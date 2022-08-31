import { useMemo } from 'react';
import { useQuery } from "react-admin";
import renderMentions from "./renderMentions";
import { useDataModel } from "@semapps/semantic-data-provider";

const useMentions = (userResource) => {
  const userDataModel = useDataModel(userResource);

  // The "enabled" option doesn't work with useQueryWithStore
  const { data } = useQuery(
    {
      type: 'getList',
      resource: userResource,
      payload: {
        filter: {
          _predicates: [userDataModel?.fieldsMapping?.title],
          blankNodes: []
        }
      }
    },
    {
      enabled: !!userDataModel?.fieldsMapping?.title,
    }
  );

  const availableMentions = useMemo(() => {
    if (data) {
      return data.map(item => ({ id: item.id, label: item[userDataModel?.fieldsMapping?.title] }));
    }
  }, [data])

  const items = useMemo(() => {
    if(availableMentions) {
      return ({ query }) => {
        return availableMentions
          .filter(({ label }) => label.toLowerCase().startsWith(query.toLowerCase()))
          .slice(0, 5)
      }
    }
  }, [availableMentions]);

  return ({
    items,
    render: renderMentions
  });
};

export default useMentions;
