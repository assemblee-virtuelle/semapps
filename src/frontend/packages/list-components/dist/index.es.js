import {jsx as $2An97$jsx, jsxs as $2An97$jsxs, Fragment as $2An97$Fragment} from "react/jsx-runtime";
import $2An97$react, {cloneElement as $2An97$cloneElement, Children as $2An97$Children, useEffect as $2An97$useEffect, createElement as $2An97$createElement, useState as $2An97$useState} from "react";
import {useListContext as $2An97$useListContext, useCreatePath as $2An97$useCreatePath, sanitizeListRestProps as $2An97$sanitizeListRestProps, RecordContextProvider as $2An97$RecordContextProvider, ChipField as $2An97$ChipField, Link as $2An97$Link, useResourceContext as $2An97$useResourceContext, useGetList as $2An97$useGetList, useResourceDefinition as $2An97$useResourceDefinition, FilterList as $2An97$FilterList, FilterListItem as $2An97$FilterListItem, List as $2An97$List, TopToolbar as $2An97$TopToolbar, CreateButton as $2An97$CreateButton, ExportButton as $2An97$ExportButton, Button as $2An97$Button} from "react-admin";
import {makeStyles as $2An97$makeStyles, LinearProgress as $2An97$LinearProgress, Grid as $2An97$Grid, Card as $2An97$Card, CardActionArea as $2An97$CardActionArea, CardMedia as $2An97$CardMedia, CardContent as $2An97$CardContent, CardActions as $2An97$CardActions, useMediaQuery as $2An97$useMediaQuery} from "@mui/material";
import $2An97$muiiconsmaterialAddCircle from "@mui/icons-material/AddCircle";
import $2An97$muiiconsmaterialLaunch from "@mui/icons-material/Launch";
import {useGetExternalLink as $2An97$useGetExternalLink, useContainers as $2An97$useContainers} from "@semapps/semantic-data-provider";
import $2An97$reactmasonrycss from "react-masonry-css";
import {useLocation as $2An97$useLocation} from "react-router";








const $ac8d3f9fb7c659a5$var$useStyles = (0, $2An97$makeStyles)(()=>({
        root: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        link: {
            textDecoration: 'none',
            maxWidth: '100%'
        },
        chipField: {
            maxWidth: '100%'
        },
        addIcon: {
            cursor: 'pointer',
            fontSize: 35,
            position: 'relative',
            top: 2
        },
        launchIcon: {
            width: 20,
            paddingRight: 6,
            marginLeft: -10
        }
    }));
const $ac8d3f9fb7c659a5$var$stopPropagation = (e)=>e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $ac8d3f9fb7c659a5$var$handleClick = ()=>{};
const $ac8d3f9fb7c659a5$var$ChipList = (props)=>{
    const { classes: classesOverride, className: className, children: children, linkType: linkType = 'edit', component: component = 'div', primaryText: primaryText, appendLink: appendLink, externalLinks: externalLinks = false, ...rest } = props;
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
    const { data: data, isLoading: isLoading, resource: resource } = (0, $2An97$useListContext)(props);
    const getExternalLink = (0, $2An97$useGetExternalLink)(externalLinks);
    const createPath = (0, $2An97$useCreatePath)();
    // @ts-expect-error TS(2349): This expression is not callable.
    const classes = $ac8d3f9fb7c659a5$var$useStyles(props);
    const Component = component;
    if (isLoading) return /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$LinearProgress), {});
    return /*#__PURE__*/ (0, $2An97$jsxs)(Component, {
        className: classes.root,
        ...(0, $2An97$sanitizeListRestProps)(rest),
        children: [
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            data.map((record)=>{
                if (!record || record._error) return null;
                const externalLink = getExternalLink(record);
                if (externalLink) return /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$RecordContextProvider), {
                    value: record,
                    children: /*#__PURE__*/ (0, $2An97$jsx)("a", {
                        href: externalLink,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: classes.link,
                        onClick: $ac8d3f9fb7c659a5$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$ChipField), {
                            source: primaryText,
                            className: classes.chipField,
                            color: "secondary",
                            deleteIcon: /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$muiiconsmaterialLaunch), {
                                className: classes.launchIcon
                            }),
                            // Workaround to force ChipField to be clickable
                            onClick: $ac8d3f9fb7c659a5$var$handleClick,
                            // Required to display the delete icon
                            onDelete: $ac8d3f9fb7c659a5$var$handleClick
                        })
                    })
                }, record.id);
                if (linkType) return /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$RecordContextProvider), {
                    value: record,
                    children: /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$Link), {
                        className: classes.link,
                        to: createPath({
                            resource: resource,
                            id: record.id,
                            type: linkType
                        }),
                        onClick: $ac8d3f9fb7c659a5$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$ChipField), {
                            source: primaryText,
                            className: classes.chipField,
                            color: "secondary",
                            // Workaround to force ChipField to be clickable
                            onClick: $ac8d3f9fb7c659a5$var$handleClick
                        })
                    })
                }, record.id);
                return /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$RecordContextProvider), {
                    value: record,
                    children: /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$ChipField), {
                        source: primaryText,
                        className: classes.chipField,
                        color: "secondary",
                        // Workaround to force ChipField to be clickable
                        onClick: $ac8d3f9fb7c659a5$var$handleClick
                    })
                }, record.id);
            }),
            appendLink && /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$muiiconsmaterialAddCircle), {
                color: "primary",
                className: classes.addIcon,
                onClick: appendLink
            })
        ]
    });
};
var $ac8d3f9fb7c659a5$export$2e2bcd8739ae039 = $ac8d3f9fb7c659a5$var$ChipList;







// useful to prevent click bubbling in a datagrid with rowClick
const $468733f6384b7c1b$var$stopPropagation = (e)=>e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $468733f6384b7c1b$var$handleClick = ()=>{};
const $468733f6384b7c1b$var$GridList = ({ children: children, linkType: linkType = 'edit', externalLinks: externalLinks = false, spacing: spacing = 3, xs: xs = 6, sm: sm, md: md, lg: lg, xl: xl })=>{
    const { data: data, resource: resource, isLoading: isLoading } = (0, $2An97$useListContext)();
    const getExternalLink = (0, $2An97$useGetExternalLink)(externalLinks);
    const createPath = (0, $2An97$useCreatePath)();
    if (isLoading || !data) return null;
    return /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$Grid), {
        container: true,
        spacing: spacing,
        children: data.map((record)=>{
            if (!record || record._error) return null;
            const externalLink = getExternalLink(record);
            let child;
            if (externalLink) child = /*#__PURE__*/ (0, $2An97$jsx)("a", {
                href: externalLink,
                target: "_blank",
                rel: "noopener noreferrer",
                onClick: $468733f6384b7c1b$var$stopPropagation,
                children: /*#__PURE__*/ $2An97$cloneElement($2An97$Children.only(children), {
                    externalLink: true,
                    // Workaround to force ChipField to be clickable
                    onClick: $468733f6384b7c1b$var$handleClick
                })
            });
            else if (linkType) child = /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$Link), {
                to: createPath({
                    resource: resource,
                    id: record.id,
                    type: linkType
                }),
                onClick: $468733f6384b7c1b$var$stopPropagation,
                children: /*#__PURE__*/ $2An97$cloneElement($2An97$Children.only(children), {
                    // Workaround to force ChipField to be clickable
                    onClick: $468733f6384b7c1b$var$handleClick
                })
            });
            else child = children;
            return(// @ts-expect-error TS(2769): No overload matches this call.
            /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$Grid), {
                item: true,
                xs: xs,
                sm: sm,
                md: md,
                lg: lg,
                xl: xl,
                children: /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$RecordContextProvider), {
                    value: record,
                    children: child
                })
            }, record.id));
        })
    });
};
var $468733f6384b7c1b$export$2e2bcd8739ae039 = $468733f6384b7c1b$var$GridList;







const $c1a0c00844004930$var$useStyles = (0, $2An97$makeStyles)(()=>({
        grid: {
            display: 'flex',
            marginLeft: -20,
            marginBottom: -20,
            width: 'auto'
        },
        column: {
            paddingLeft: 20,
            backgroundClip: 'padding-box'
        },
        card: {
            marginBottom: 20
        },
        media: {
            height: 0,
            paddingTop: '56.25%' // 16:9
        }
    }));
/**
 * @example
 * <List component="div" perPage={50} {...props}>
 *   <MasonryList
 *     image={record => record.image}
 *     content={record => (
 *       <>
 *         <Typography variant="subtitle1">{record.title}</Typography>
 *         <Typography variant="body2" color="textSecondary" component="p">{record.description}</Typography>
 *       </>
 *     )}
 *     linkType="show"
 *   />
 * </List>
 */ const $c1a0c00844004930$var$MasonryList = ({ image: image, content: content, actions: actions, breakpointCols: breakpointCols = {
    default: 3,
    1050: 2,
    700: 1
}, linkType: linkType = 'edit' })=>{
    // @ts-expect-error TS(2349): This expression is not callable.
    const classes = $c1a0c00844004930$var$useStyles();
    const { data: data, resource: resource } = (0, $2An97$useListContext)();
    const createPath = (0, $2An97$useCreatePath)();
    return /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$reactmasonrycss), {
        breakpointCols: breakpointCols,
        className: classes.grid,
        columnClassName: classes.column,
        children: // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        data.map((record)=>{
            if (!record || record._error) return null;
            const imageUrl = typeof image === 'function' ? image(record) : image;
            return /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$RecordContextProvider), {
                value: record,
                children: /*#__PURE__*/ (0, $2An97$jsxs)((0, $2An97$Card), {
                    className: classes.card,
                    children: [
                        /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$Link), {
                            to: createPath({
                                resource: resource,
                                id: record.id,
                                type: linkType
                            }),
                            children: /*#__PURE__*/ (0, $2An97$jsxs)((0, $2An97$CardActionArea), {
                                children: [
                                    imageUrl && /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$CardMedia), {
                                        className: classes.media,
                                        image: imageUrl
                                    }),
                                    content && /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$CardContent), {
                                        children: content(record)
                                    })
                                ]
                            })
                        }),
                        actions && /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$CardActions), {
                            children: actions.map((action)=>/*#__PURE__*/ (0, $2An97$react).createElement(action))
                        })
                    ]
                }, record.id)
            });
        })
    });
};
var $c1a0c00844004930$export$2e2bcd8739ae039 = $c1a0c00844004930$var$MasonryList;


/* eslint-disable react/react-in-jsx-scope */ /* eslint-disable react/require-default-props */ 



/**
 * @example
 * const FilterAside = () => (
 *   <Card>
 *     <CardContent>
 *       <FilterLiveSearch source="pair:label" />
 *       <ReferenceFilter reference="Theme" source="pair:hasTopic" inverseSource="pair:topicOf" />
 *       <ReferenceFilter reference="Skill" source="pair:offers" inverseSource="pair:offeredBy" />
 *     </CardContent>
 *   </Card>
 * );
 */ // Converts an element to array or returns it if it's already an array
const $5ced1203870db4f6$var$toArray = (e)=>[].concat(e);
const $5ced1203870db4f6$var$ReferenceFilterCounter = ({ source: source, id: id })=>{
    const resourceContext = (0, $2An97$useResourceContext)();
    // @ts-expect-error TS(2345): Argument of type 'ResourceContextValue' is not ass... Remove this comment to see the full error message
    const { data: data } = (0, $2An97$useGetList)(resourceContext, {
        pagination: {
            page: 1,
            perPage: Infinity
        }
    });
    return /*#__PURE__*/ (0, $2An97$jsxs)((0, $2An97$Fragment), {
        children: [
            "\xa0",
            data && /*#__PURE__*/ (0, $2An97$jsx)("span", {
                className: "filter-count",
                children: `(${data.filter((d)=>$5ced1203870db4f6$var$toArray(d[source]).includes(id)).length})`
            })
        ]
    });
};
const $5ced1203870db4f6$var$ReferenceFilter = ({ reference: reference, source: source, inverseSource: inverseSource, limit: limit = 25, sort: sort, filter: filter, label: label, icon: icon, showCounters: showCounters = true })=>{
    const { data: data, isLoading: isLoading } = (0, $2An97$useGetList)(reference, {
        pagination: {
            page: 1,
            perPage: limit
        },
        sort: sort,
        filter: filter
    });
    const currentResource = (0, $2An97$useResourceDefinition)({
        resource: reference
    });
    const resourceContext = (0, $2An97$useResourceContext)();
    const resourceContextContainers = (0, $2An97$useContainers)(resourceContext);
    const { setFilters: setFilters } = (0, $2An97$useListContext)();
    (0, $2An97$useEffect)(()=>{
        // Needed when filter item is active and its last relation is removed
        const urlSearchParams = new URLSearchParams(window.location.search);
        if (!urlSearchParams.get('filter') && !isLoading) setFilters({}, []);
    }, [
        isLoading,
        setFilters
    ]);
    const itemIsUsed = (itemData)=>{
        if (!inverseSource) return true;
        if (!resourceContextContainers || !itemData) return false;
        return Object.values(resourceContextContainers).flat().some((containerUrl)=>{
            if (!itemData[inverseSource]) return false;
            return $5ced1203870db4f6$var$toArray(itemData[inverseSource]).some((inverseSourceData)=>{
                return inverseSourceData?.startsWith(containerUrl);
            });
        });
    };
    return /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$FilterList), {
        label: label || currentResource?.options?.label || '',
        icon: icon || currentResource?.icon ? /*#__PURE__*/ (0, $2An97$createElement)(currentResource.icon) : undefined,
        children: data && data.filter((itemData)=>itemIsUsed(itemData)).map((itemData)=>/*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$FilterListItem), {
                label: /*#__PURE__*/ (0, $2An97$jsxs)("span", {
                    className: "filter-label",
                    children: [
                        itemData['pair:label'],
                        showCounters && /*#__PURE__*/ (0, $2An97$jsx)($5ced1203870db4f6$var$ReferenceFilterCounter, {
                            source: source,
                            id: itemData.id
                        })
                    ]
                }),
                value: {
                    [source]: itemData.id
                }
            }, itemData.id))
    });
};
var $5ced1203870db4f6$export$2e2bcd8739ae039 = $5ced1203870db4f6$var$ReferenceFilter;















const $f766da04c6172f0e$var$ListViewContext = (0, $2An97$react).createContext({
    views: null,
    currentView: null,
    setView: ()=>null
});
var $f766da04c6172f0e$export$2e2bcd8739ae039 = $f766da04c6172f0e$var$ListViewContext;


const $4c3f5afe13755d88$var$ViewsButtons = ()=>{
    const query = new URLSearchParams((0, $2An97$useLocation)().search);
    const { views: views, currentView: currentView, setView: setView } = (0, $2An97$react).useContext((0, $f766da04c6172f0e$export$2e2bcd8739ae039));
    return views ? Object.entries(views).filter(([key])=>key !== currentView).map(([key, view])=>{
        query.set('view', key);
        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        query.set('page', 1);
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        query.set('perPage', view.perPage);
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        if (view.sort) {
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            query.set('sort', view.sort.field);
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            query.set('order', view.sort.order);
        }
        return /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$Link), {
            to: `?${query.toString()}`,
            children: /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$Button), {
                // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                onClick: ()=>setView(key),
                // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                label: view.label,
                children: // @ts-expect-error TS(2571): Object is of type 'unknown'.
                /*#__PURE__*/ (0, $2An97$react).createElement(view.icon)
            })
        }, key);
    }) : null;
};
var $4c3f5afe13755d88$export$2e2bcd8739ae039 = $4c3f5afe13755d88$var$ViewsButtons;


const $2883abf439400349$var$ListActionsWithViews = ({ bulkActions: bulkActions, basePath: basePath, sort: sort, displayedFilters: displayedFilters, exporter: exporter, filters: filters, filterValues: filterValues, onUnselectItems: onUnselectItems, selectedIds: selectedIds, showFilter: showFilter, total: total, ...rest })=>{
    const xs = (0, $2An97$useMediaQuery)((theme)=>theme.breakpoints.down('sm'));
    const resourceDefinition = (0, $2An97$useResourceDefinition)(rest);
    return /*#__PURE__*/ (0, $2An97$jsxs)((0, $2An97$TopToolbar), {
        children: [
            /*#__PURE__*/ (0, $2An97$jsx)((0, $4c3f5afe13755d88$export$2e2bcd8739ae039), {}),
            filters && /*#__PURE__*/ (0, $2An97$react).cloneElement(filters, {
                showFilter: showFilter,
                displayedFilters: displayedFilters,
                filterValues: filterValues,
                context: 'button'
            }),
            resourceDefinition.hasCreate && /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$CreateButton), {}),
            !xs && exporter !== false && // @ts-expect-error TS(2322): Type '{ disabled: boolean; sort: any; filter: any;... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$ExportButton), {
                disabled: total === 0,
                sort: sort,
                filter: filterValues,
                exporter: exporter
            }),
            bulkActions && /*#__PURE__*/ (0, $2An97$react).cloneElement(bulkActions, {
                filterValues: filterValues,
                selectedIds: selectedIds,
                onUnselectItems: onUnselectItems
            })
        ]
    });
};
var $2883abf439400349$export$2e2bcd8739ae039 = $2883abf439400349$var$ListActionsWithViews;



const $eb528b9142b3985e$var$MultiViewsList = ({ children: children, actions: actions = /*#__PURE__*/ (0, $2An97$jsx)((0, $2883abf439400349$export$2e2bcd8739ae039), {}), views: views, ListComponent: ListComponent = (0, $2An97$List), ...otherProps })=>{
    const query = new URLSearchParams((0, $2An97$useLocation)().search);
    const initialView = query.has('view') ? query.get('view') : Object.keys(views)[0];
    const [currentView, setView] = (0, $2An97$useState)(initialView);
    return(// @ts-expect-error TS(2322): Type 'string | null' is not assignable to type 'nu... Remove this comment to see the full error message
    /*#__PURE__*/ (0, $2An97$jsx)((0, $f766da04c6172f0e$export$2e2bcd8739ae039).Provider, {
        value: {
            views: views,
            currentView: currentView,
            setView: setView
        },
        children: /*#__PURE__*/ (0, $2An97$jsx)(ListComponent, {
            actions: actions,
            // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
            pagination: views[currentView].pagination,
            // Set initial values, but use the query string to change these values to avoid a complete refresh
            // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
            perPage: views[initialView].perPage,
            // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
            sort: views[initialView].sort,
            ...otherProps,
            children: // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
            views[currentView].list
        })
    }));
};
var $eb528b9142b3985e$export$2e2bcd8739ae039 = $eb528b9142b3985e$var$MultiViewsList;







export {$ac8d3f9fb7c659a5$export$2e2bcd8739ae039 as ChipList, $468733f6384b7c1b$export$2e2bcd8739ae039 as GridList, $c1a0c00844004930$export$2e2bcd8739ae039 as MasonryList, $5ced1203870db4f6$export$2e2bcd8739ae039 as ReferenceFilter, $eb528b9142b3985e$export$2e2bcd8739ae039 as MultiViewsList, $2883abf439400349$export$2e2bcd8739ae039 as ListActionsWithViews, $f766da04c6172f0e$export$2e2bcd8739ae039 as ListViewContext, $4c3f5afe13755d88$export$2e2bcd8739ae039 as ViewsButtons};
//# sourceMappingURL=index.es.js.map
