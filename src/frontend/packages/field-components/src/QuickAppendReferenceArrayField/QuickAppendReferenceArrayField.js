import React, { useState, useMemo } from 'react';
import { useRecordContext, usePermissions } from 'react-admin';
import ReferenceArrayField from '../ReferenceArrayField';
import QuickAppendDialog from './QuickAppendDialog';

function QuickAppendReferenceArrayField({ reference, source, resource, children, ...otherProps }) {
  const record = useRecordContext();
  const [showDialog, setShowDialog] = useState(false);
  const { permissions } = usePermissions(record.id);

  const canAppend = useMemo(
    () => !!permissions && permissions.some(p => ['acl:Append', 'acl:Write', 'acl:Control'].includes(p['acl:mode'])),
    [permissions]
  );

  return (
    <>
      <ReferenceArrayField reference={reference} source={source} {...otherProps}>
        {React.Children.only(children) &&
          React.cloneElement(children, {
            appendLink: canAppend
              ? () => {
                  setShowDialog(true);
                }
              : undefined
          })}
      </ReferenceArrayField>
      {canAppend && showDialog && (
        <QuickAppendDialog
          open={showDialog}
          onClose={() => {
            setShowDialog(false);
          }}
          subjectUri={record.id}
          resource={resource}
          source={source}
          reference={reference}
        />
      )}
    </>
  );
}

export default QuickAppendReferenceArrayField;
