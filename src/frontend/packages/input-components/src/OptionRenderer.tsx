import React from 'react';
import { useRecordContext } from 'react-admin';

const OptionRenderer = ({ optionText, dataServers }: any) => {
  const record = useRecordContext();
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const server = dataServers && Object.values(dataServers).find(server => record.id.startsWith(server.baseUrl));
  return (
    <span>
      {
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        record[optionText]
      }
      {server && (
        <em className="serverName" style={{ color: 'grey' }}>
          &nbsp;({server.name})
        </em>
      )}
    </span>
  );
};

export default OptionRenderer;
