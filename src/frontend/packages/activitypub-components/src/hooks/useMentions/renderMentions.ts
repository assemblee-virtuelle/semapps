import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import MentionsList from './MentionsList';

const renderMentions = () => {
  let component: any;
  let popup: any;

  return {
    onStart: (props: any) => {
      component = new ReactRenderer(MentionsList, {
        props,
        editor: props.editor
      });

      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start'
      });
    },
    onUpdate(props: any) {
      component.updateProps(props);

      popup[0].setProps({
        getReferenceClientRect: props.clientRect
      });
    },
    onKeyDown(props: any) {
      if (props.event.key === 'Escape') {
        popup[0].hide();

        return true;
      }

      return component.ref?.onKeyDown(props);
    },

    onExit() {
      popup[0].destroy();
      component.destroy();
    }
  };
};

export default renderMentions;
