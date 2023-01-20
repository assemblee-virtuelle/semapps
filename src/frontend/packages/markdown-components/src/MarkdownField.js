import React from 'react';
import Markdown from 'markdown-to-jsx';

const MarkdownField = ({ source, record, LabelComponent, overrides = {}, ...rest }) =>
  record && record[source] ? (
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
          } else {
            return React.createElement(type, props, children);
          }
        },
        overrides: {
          h1: LabelComponent,
          ...overrides
        },
        ...rest
      }}
    >
      {record[source]}
    </Markdown>
  ) : null;

MarkdownField.defaultProps = {
  LabelComponent: 'h2'
};

export default MarkdownField;
