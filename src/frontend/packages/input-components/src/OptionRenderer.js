import React from 'react';

const OptionRenderer = ({ record, optionText, dataServers, suggestion }) => {
  const server = dataServers && Object.values(dataServers).find(server => record.id.startsWith(server.baseUrl));
  if (!record || !server) return "Créer "+suggestion ;
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
