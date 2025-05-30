import React from 'react';
import { useRecordContext } from 'react-admin';
import Markdown from 'markdown-to-jsx';
import get from 'lodash/get';

const MarkdownField = ({ source, LabelComponent = 'h2', overrides = {}, ...rest }) => {
  const record = useRecordContext();
  if (!record || !get(record, source)) return null;

  return (
    <Markdown
      options={{
        createElement(type, props, children) {
          if (props.label) {
            return (
              <>
                <LabelComponent>{props.label}</LabelComponent>
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
