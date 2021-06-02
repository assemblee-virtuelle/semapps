import React from 'react';
import { LargeLabel } from '@semapps/archipelago-layout';
import Markdown from 'markdown-to-jsx';

const MarkdownField = ({ source, record, overrides = {}, ...rest }) =>
  record && record[source] ? (
    <Markdown
      options={{
        createElement(type, props, children) {
          if (props.label) {
            return (
              <>
                <LargeLabel>{props.label}</LargeLabel>
                {React.createElement(type, props, children)}
              </>
            );
          } else {
            return React.createElement(type, props, children);
          }
        },
        overrides: {
          h1: LargeLabel,
          ...overrides
        },
        ...rest
      }}
    >
      {record[source]}
    </Markdown>
  ) : null;

MarkdownField.defaultProps = {
  addLabel: true
};

export default MarkdownField;
