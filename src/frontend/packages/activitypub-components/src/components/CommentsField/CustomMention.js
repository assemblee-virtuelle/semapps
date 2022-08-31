import { mergeAttributes } from '@tiptap/core';
import Mention from '@tiptap/extension-mention';

// Fix a bug in the current version of the mention extension
// (The { id, label } object is located inside the id property)
// See https://github.com/ueberdosis/tiptap/pull/1322
const CustomMention = Mention.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      `@${node.attrs.id.label}`
    ]
  },
  addAttributes() {
    return {
      label: {
        default: null,
        parseHTML: element => {
          return {
            label: element.getAttribute('data-mention-label'),
          }
        },
        renderHTML: attributes => {
          if (!attributes.id.label) {
            return {}
          }
          return {
            'data-mention-label': attributes.id.label,
          }
        },
      },
      id: {
        default: null,
        parseHTML: element => {
          return {
            id: element.getAttribute('data-mention-id'),
          }
        },
        renderHTML: attributes => {
          if (!attributes.id.id) {
            return {}
          }
          return {
            'data-mention-id': attributes.id.id,
          }
        },
      },
    }
  },
});

export default CustomMention;
