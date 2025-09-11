import React from 'react';
import { useRecordContext } from 'react-admin';
import Markdown from 'markdown-to-jsx';
import get from 'lodash/get';

const MarkdownField = ({ source, LabelComponent = 'h2', overrides = {}, ...rest }: any) => {
  const record = useRecordContext();
  if (!record || !get(record, source)) return null;

  return (
    <Markdown
      options={{
        createElement(type, props, children) {
          // @ts-expect-error TS(2339): Property 'label' does not exist on type 'Intrinsic... Remove this comment to see the full error message
          if (props.label) {
            return (
              <>
                <LabelComponent>
                  {
                    // @ts-expect-error TS(2339): Property 'label' does not exist on type 'Intrinsic... Remove this comment to see the full error message
                    props.label
                  }
                </LabelComponent>
                {React.createElement(type, props, children)}
              </>
            );
          }
          return React.createElement(type, props, children);
        },
        overrides: {
          h1: LabelComponent,
          ...overrides
        },
        ...rest
      }}
    >
      {get(record, source)}
    </Markdown>
  );
};

export default MarkdownField;
