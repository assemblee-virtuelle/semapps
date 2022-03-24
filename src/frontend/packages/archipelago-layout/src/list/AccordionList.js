import React from 'react';
import { useListContext } from 'react-admin';
import { makeStyles, Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  accordion: {
    backgroundColor: theme.palette.grey[200]
  },
  accordionSummary: {
    minHeight: '0 !important',
    '& div': {
      margin: '0 !important'
    }
  },
  accordionDetails: {
    backgroundColor: theme.palette.common.white,
    display: 'block',
    '& p': {
      margin: 0
    }
  },
  date: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    flexBasis: '15%',
    flexShrink: 0
  },
  title: {
    fontSize: theme.typography.pxToRem(15)
  }
}));

const AccordionList = ({ date, title, content }) => {
  const classes = useStyles();
  const { ids, data, resource, basePath } = useListContext();
  return (
    <div className={classes.root}>
      {ids.map((id, i) => {
        if( !data[id] ) return null;
        const computedDate = date && new Date(date(data[id]));
        const computedTitle = title && title(data[id]);
        return (
          <Accordion className={classes.accordion} key={i}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${i}-content`}
              id={`panel${i}-header`}
              className={classes.accordionSummary}
            >
              {computedDate && <Typography className={classes.date}>{computedDate.toLocaleDateString()}</Typography>}
              <Typography className={classes.title}>{computedTitle}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              {React.createElement(content, { record: data[id], resource, basePath })}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default AccordionList;
