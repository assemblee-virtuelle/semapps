import React from 'react';
import { useRecordContext } from 'react-admin';

const OptionRenderer = ({ optionText, dataServers }) => {
  const record = useRecordContext();
  const server = dataServers && Object.values(dataServers).find(server => record.id.startsWith(server.baseUrl));
  return (
    <span>
      {record[optionText]}
      {server && (
        <em className="serverName" style={{ color: 'grey' }}>
          &nbsp;({server.name})
        </em>
      )}
    </span>
  );
};

export default OptionRenderer;
