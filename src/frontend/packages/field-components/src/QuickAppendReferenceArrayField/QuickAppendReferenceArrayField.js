import React, { useState, useMemo } from 'react';
import { ReferenceArrayField as RaReferenceArrayField, usePermissionsOptimized } from 'react-admin';
import QuickAppendDialog from './QuickAppendDialog';

const QuickAppendReferenceArrayField = ({ record, reference, source, resource, ...otherProps }) => {
  const [showDialog, setShowDialog] = useState(false);
  const { permissions } = usePermissionsOptimized(record.id);

  const canAppend = useMemo(
    () => !!permissions && permissions.some(p => ['acl:Append', 'acl:Write', 'acl:Control'].includes(p['acl:mode'])),
    [permissions]
  );

  if (record?.[source]) {
    if (!Array.isArray(record[source])) {
      record[source] = [record[source]];
    }
    record[source] = record[source].map(i => i['@id'] || i.id || i);
  }

  return (
    <>
      <RaReferenceArrayField
        record={record}
        reference={reference}
        source={source}
        resource={resource}
        appendLink={canAppend ? () => setShowDialog(true) : undefined}
        {...otherProps}
      />
      {canAppend && showDialog && (
        <QuickAppendDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          subjectUri={record.id}
          resource={resource}
          source={source}
          reference={reference}
        />
      )}
    </>
  );
};

export default QuickAppendReferenceArrayField;
