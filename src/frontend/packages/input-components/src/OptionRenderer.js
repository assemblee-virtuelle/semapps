import React from 'react';

const OptionRenderer = ({ record, optionText, dataServers, keyword, ...rest }) => {
  const server = dataServers && Object.values(dataServers).find(server => record.id.startsWith(server.baseUrl));
  if (rest.create && (!record || !server)) return "Créer "+keyword ;
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
