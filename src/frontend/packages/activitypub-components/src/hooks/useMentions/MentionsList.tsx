import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(theme => ({
  items: {
    background: '#fff',
    borderRadius: '0.5rem',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1)',
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: '0.9rem',
    overflow: 'hidden',
    padding: '0.2rem',
    position: 'relative'
  },
  item: {
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: '0.4rem',
    display: 'block',
    margin: 0,
    padding: '0.2rem 0.4rem',
    textAlign: 'left',
    width: '100%',
    '&.selected': {
      borderColor: '#000'
    }
  }
}));

export default forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { classes } = useStyles();

  const selectItem = (index: any) => {
    // @ts-expect-error TS(2339): Property 'items' does not exist on type '{}'.
    const item = props.items[index];

    if (item) {
      // @ts-expect-error TS(2339): Property 'command' does not exist on type '{}'.
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    // @ts-expect-error TS(2339): Property 'items' does not exist on type '{}'.
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    // @ts-expect-error TS(2339): Property 'items' does not exist on type '{}'.
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  // @ts-expect-error TS(2339): Property 'items' does not exist on type '{}'.
  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    }
  }));

  return (
    <div className={classes.items}>
      {props.items.length ? (
        // @ts-expect-error TS(2339): Property 'items' does not exist on type '{}'.
        props.items.map((item: any, index: any) => (
          <button
            className={classes.item + (index === selectedIndex ? ' selected' : '')}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item.label}
          </button>
        ))
      ) : (
        <div className={classes.item}>Aucun résultat</div>
      )}
    </div>
  );
});
