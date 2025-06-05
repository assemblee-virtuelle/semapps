import React, { useState, useMemo } from 'react';
import { useRecordContext, usePermissions } from 'react-admin';
import { ReferenceArrayField } from '../index';
import QuickAppendDialog from './QuickAppendDialog';

const QuickAppendReferenceArrayField = ({
  reference,
  source,
  resource,
  children,
  ...otherProps
}: any) => {
  const record = useRecordContext();
  const [showDialog, setShowDialog] = useState(false);
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  const { permissions } = usePermissions({ uri: record.id });

  const canAppend = useMemo(
    () => !!permissions && permissions.some((p: any) => ['acl:Append', 'acl:Write', 'acl:Control'].includes(p['acl:mode'])),
    [permissions]
  );

  return (
    <>
      <ReferenceArrayField reference={reference} source={source} {...otherProps}>
        {React.Children.only(children) &&
          React.cloneElement(children, { appendLink: canAppend ? () => setShowDialog(true) : undefined })}
      </ReferenceArrayField>
      {canAppend && showDialog && (
        <QuickAppendDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
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
