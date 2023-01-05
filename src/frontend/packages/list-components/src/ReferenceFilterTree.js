import React from 'react';
import { useGetList } from 'react-admin';
import {TreeItem, TreeView, useTreeItem} from '@mui/lab';
import { useListFilterContext } from 'ra-core';
import CancelIcon from '@mui/icons-material/Cancel';
import LabelIcon from '@mui/icons-material/Label';
import { IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';

/**
 * @example
 * const FilterAside = () => (
 *   <Card>
 *     <CardContent>
 *       <FilterLiveSearch source="pair:label" />
 *       <ReferenceFilter reference="Theme" source="pair:broader" label="pair:label"  />
 *     </CardContent>
 *   </Card>
 * );
 */


function GenerateTreeItemFromNarrower( source, label, themeList, narrower) {
  let narrowerChild = {};
  let isLastNarrower = false;
  return (
    themeList.map(function(theme) { 
      if (theme != undefined) {
        if (theme[source] == narrower["id"]) {
          themeList.map(function(t) {
            if (t[source] != undefined && t[source] == theme["id"]) {
              isLastNarrower = true;
              narrowerChild = t;
            }
          })
          return (
          <CustomTreeItem key={theme["id"]} nodeId={theme["id"]} label={theme[label]} >
            {isLastNarrower ? GenerateTreeItemFromNarrower(source, label, themeList, theme) : null }
          </CustomTreeItem>
          )
        }
      }
    })
  )
}

const CustomContent = React.forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  );
});


function CustomTreeItem(props) {
  return <TreeItem ContentComponent={CustomContent} {...props} />;
}

const ReferenceFilterTree = ({ reference, source, label, limit, sort, filter }) => {
  const { data } = useGetList(reference, { page: 1, perPage: limit }, sort, filter);
  const { filterValues, setFilters } = useListFilterContext();
  let routeTree = [], listTheme = [], isThemeSelected = false;

  for (const theme in data) {
    if (data[theme]['pair:broader'] == undefined ) {
      routeTree.push(data[theme]);
    }
    listTheme = listTheme.concat(data[theme]);
  }

  function deleteFilterTheme() {
    const newFilterValues = Object.assign({}, filterValues);
    delete newFilterValues.sparqlWhere;
    setFilters(newFilterValues, null, false);
    isThemeSelected = false
  }

  const handleSelect = (event, nodes) => {
    const sparqlWhere = {
      "type": "bgp",
      "triples": nodes.map((node) => {
        return {
          subject: {
            termType: 'Variable',
            value: 's1',
          },
          predicate: {
            termType: 'NamedNode',
            value: "http://virtual-assembly.org/ontologies/pair#hasTopic",
          },
          object: {
            termType: 'NamedNode',
            value: node,
          },
        };
      }),
    }

    const query = JSON.stringify(sparqlWhere);
    const encodedQuery = encodeURIComponent(query);
    setFilters({...filterValues, "sparqlWhere": encodedQuery })

  }
  console.log(filterValues)
  if (filterValues.sparqlWhere != undefined)
    isThemeSelected = true

  return (
    <div >
      <IconButton size="small" edge="start">
        <LabelIcon style={{ color: 'black',  }} />
      </IconButton>
      Thèmes
      {isThemeSelected ? <IconButton onClick={deleteFilterTheme} size="small">
        <CancelIcon />
      </IconButton> : null}
      <TreeView
        multiSelect
        onNodeSelect={handleSelect}
        aria-label="icon expansion"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {routeTree.map((route) =>
          <CustomTreeItem nodeId={route["id"]} label={route[label]} key={route["id"]}>
            {GenerateTreeItemFromNarrower(source, label, listTheme, route)}
          </CustomTreeItem>
        )}
      </TreeView>
    </div>
  )
};

ReferenceFilterTree.defaultProps = {
  limit: 25,
  showCounters: true
};

export default ReferenceFilterTree;

