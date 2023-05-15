import React, { useState, useMemo } from 'react';
import { ReferenceArrayField as RaReferenceArrayField, useRecordContext, usePermissionsOptimized } from 'react-admin';
import QuickAppendDialog from './QuickAppendDialog';

const QuickAppendReferenceArrayField = ({ reference, source, resource, ...otherProps }) => {
  const record = useRecordContext();
  const [showDialog, setShowDialog] = useState(false);
  const { permissions } = usePermissionsOptimized(record.id);

  console.log('permissions', permissions)

  const canAppend = useMemo(
    () => !!permissions && permissions.some(p => ['acl:Append', 'acl:Write', 'acl:Control'].includes(p['acl:mode'])),
    [permissions]
  );

  console.log('canAppend', canAppend);

  if (record?.[source]) {
    if (!Array.isArray(record[source])) {
      record[source] = [record[source]];
    }
    record[source] = record[source].map(i => i['@id'] || i.id || i);
  }

  return (
    <>
      <RaReferenceArrayField
        reference={reference}
        source={source}
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
