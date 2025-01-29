import {jsx as $2An97$jsx, jsxs as $2An97$jsxs, Fragment as $2An97$Fragment} from "react/jsx-runtime";
import $2An97$react, {cloneElement as $2An97$cloneElement, Children as $2An97$Children, useEffect as $2An97$useEffect, createElement as $2An97$createElement, useState as $2An97$useState} from "react";
import {useListContext as $2An97$useListContext, useCreatePath as $2An97$useCreatePath, sanitizeListRestProps as $2An97$sanitizeListRestProps, RecordContextProvider as $2An97$RecordContextProvider, ChipField as $2An97$ChipField, Link as $2An97$Link, useResourceContext as $2An97$useResourceContext, useGetList as $2An97$useGetList, useResourceDefinition as $2An97$useResourceDefinition, FilterList as $2An97$FilterList, FilterListItem as $2An97$FilterListItem, List as $2An97$List, TopToolbar as $2An97$TopToolbar, CreateButton as $2An97$CreateButton, ExportButton as $2An97$ExportButton, Button as $2An97$Button} from "react-admin";
import {LinearProgress as $2An97$LinearProgress, Grid as $2An97$Grid, Card as $2An97$Card, CardActionArea as $2An97$CardActionArea, CardMedia as $2An97$CardMedia, CardContent as $2An97$CardContent, CardActions as $2An97$CardActions, useMediaQuery as $2An97$useMediaQuery} from "@mui/material";
import $2An97$muistylesmakeStyles from "@mui/styles/makeStyles";
import $2An97$muiiconsmaterialAddCircle from "@mui/icons-material/AddCircle";
import $2An97$muiiconsmaterialLaunch from "@mui/icons-material/Launch";
import {useGetExternalLink as $2An97$useGetExternalLink, useContainers as $2An97$useContainers} from "@semapps/semantic-data-provider";
import $2An97$reactmasonrycss from "react-masonry-css";
import {useLocation as $2An97$useLocation} from "react-router";









const $a854ae8777f8f757$var$useStyles = (0, $2An97$muistylesmakeStyles)(()=>({
        root: {
            display: "flex",
            flexWrap: "wrap"
        },
        link: {
            textDecoration: "none",
            maxWidth: "100%"
        },
        chipField: {
            maxWidth: "100%"
        },
        addIcon: {
            cursor: "pointer",
            fontSize: 35,
            position: "relative",
            top: 2
        },
        launchIcon: {
            width: 20,
            paddingRight: 6,
            marginLeft: -10
        }
    }));
const $a854ae8777f8f757$var$stopPropagation = (e)=>e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $a854ae8777f8f757$var$handleClick = ()=>{};
const $a854ae8777f8f757$var$ChipList = (props)=>{
    const { classes: classesOverride, className: className, children: children, linkType: linkType = "edit", component: component = "div", primaryText: primaryText, appendLink: appendLink, externalLinks: externalLinks = false, ...rest } = props;
    const { data: data, isLoading: isLoading, resource: resource } = (0, $2An97$useListContext)(props);
    const getExternalLink = (0, $2An97$useGetExternalLink)(externalLinks);
    const createPath = (0, $2An97$useCreatePath)();
    const classes = $a854ae8777f8f757$var$useStyles(props);
    const Component = component;
    if (isLoading) return /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$LinearProgress), {});
    return /*#__PURE__*/ (0, $2An97$jsxs)(Component, {
        className: classes.root,
        ...(0, $2An97$sanitizeListRestProps)(rest),
        children: [
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
                        onClick: $a854ae8777f8f757$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$ChipField), {
                            source: primaryText,
                            className: classes.chipField,
                            color: "secondary",
                            deleteIcon: /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$muiiconsmaterialLaunch), {
                                className: classes.launchIcon
                            }),
                            // Workaround to force ChipField to be clickable
                            onClick: $a854ae8777f8f757$var$handleClick,
                            // Required to display the delete icon
                            onDelete: $a854ae8777f8f757$var$handleClick
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
                        onClick: $a854ae8777f8f757$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$ChipField), {
                            source: primaryText,
                            className: classes.chipField,
                            color: "secondary",
                            // Workaround to force ChipField to be clickable
                            onClick: $a854ae8777f8f757$var$handleClick
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
                        onClick: $a854ae8777f8f757$var$handleClick
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
var $a854ae8777f8f757$export$2e2bcd8739ae039 = $a854ae8777f8f757$var$ChipList;







// useful to prevent click bubbling in a datagrid with rowClick
const $e54e9a9f27806c4d$var$stopPropagation = (e)=>e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $e54e9a9f27806c4d$var$handleClick = ()=>{};
const $e54e9a9f27806c4d$var$GridList = ({ children: children, linkType: linkType = "edit", externalLinks: externalLinks = false, spacing: spacing = 3, xs: xs = 6, sm: sm, md: md, lg: lg, xl: xl })=>{
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
                onClick: $e54e9a9f27806c4d$var$stopPropagation,
                children: /*#__PURE__*/ $2An97$cloneElement($2An97$Children.only(children), {
                    externalLink: true,
                    // Workaround to force ChipField to be clickable
                    onClick: $e54e9a9f27806c4d$var$handleClick
                })
            });
            else if (linkType) child = /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$Link), {
                to: createPath({
                    resource: resource,
                    id: record.id,
                    type: linkType
                }),
                onClick: $e54e9a9f27806c4d$var$stopPropagation,
                children: /*#__PURE__*/ $2An97$cloneElement($2An97$Children.only(children), {
                    // Workaround to force ChipField to be clickable
                    onClick: $e54e9a9f27806c4d$var$handleClick
                })
            });
            else child = children;
            return /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$Grid), {
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
            }, record.id);
        })
    });
};
var $e54e9a9f27806c4d$export$2e2bcd8739ae039 = $e54e9a9f27806c4d$var$GridList;








const $8cf7b8f98f373d84$var$useStyles = (0, $2An97$muistylesmakeStyles)(()=>({
        grid: {
            display: "flex",
            marginLeft: -20,
            marginBottom: -20,
            width: "auto"
        },
        column: {
            paddingLeft: 20,
            backgroundClip: "padding-box"
        },
        card: {
            marginBottom: 20
        },
        media: {
            height: 0,
            paddingTop: "56.25%" // 16:9
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
 */ const $8cf7b8f98f373d84$var$MasonryList = ({ image: image, content: content, actions: actions, breakpointCols: breakpointCols = {
    default: 3,
    1050: 2,
    700: 1
}, linkType: linkType = "edit" })=>{
    const classes = $8cf7b8f98f373d84$var$useStyles();
    const { data: data, resource: resource } = (0, $2An97$useListContext)();
    const createPath = (0, $2An97$useCreatePath)();
    return /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$reactmasonrycss), {
        breakpointCols: breakpointCols,
        className: classes.grid,
        columnClassName: classes.column,
        children: data.map((record)=>{
            if (!record || record._error) return null;
            const imageUrl = typeof image === "function" ? image(record) : image;
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
var $8cf7b8f98f373d84$export$2e2bcd8739ae039 = $8cf7b8f98f373d84$var$MasonryList;


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
        if (!urlSearchParams.get("filter") && !isLoading) setFilters({}, []);
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
        label: label || currentResource?.options?.label || "",
        icon: icon || currentResource?.icon ? /*#__PURE__*/ (0, $2An97$createElement)(currentResource.icon) : undefined,
        children: data && data.filter((itemData)=>itemIsUsed(itemData)).map((itemData)=>/*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$FilterListItem), {
                label: /*#__PURE__*/ (0, $2An97$jsxs)("span", {
                    className: "filter-label",
                    children: [
                        itemData["pair:label"],
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















const $4d3421bb798b6c78$var$ListViewContext = /*#__PURE__*/ (0, $2An97$react).createContext({
    views: null,
    currentView: null,
    setView: ()=>null
});
var $4d3421bb798b6c78$export$2e2bcd8739ae039 = $4d3421bb798b6c78$var$ListViewContext;


const $5a39d2966c9779bd$var$ViewsButtons = ()=>{
    const query = new URLSearchParams((0, $2An97$useLocation)().search);
    const { views: views, currentView: currentView, setView: setView } = (0, $2An97$react).useContext((0, $4d3421bb798b6c78$export$2e2bcd8739ae039));
    return views ? Object.entries(views).filter(([key])=>key !== currentView).map(([key, view])=>{
        query.set("view", key);
        query.set("page", 1);
        query.set("perPage", view.perPage);
        if (view.sort) {
            query.set("sort", view.sort.field);
            query.set("order", view.sort.order);
        }
        return /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$Link), {
            to: `?${query.toString()}`,
            children: /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$Button), {
                onClick: ()=>setView(key),
                label: view.label,
                children: /*#__PURE__*/ (0, $2An97$react).createElement(view.icon)
            })
        }, key);
    }) : null;
};
var $5a39d2966c9779bd$export$2e2bcd8739ae039 = $5a39d2966c9779bd$var$ViewsButtons;


const $032ebd19dd4d05d7$var$ListActionsWithViews = ({ bulkActions: bulkActions, basePath: basePath, sort: sort, displayedFilters: displayedFilters, exporter: exporter, filters: filters, filterValues: filterValues, onUnselectItems: onUnselectItems, selectedIds: selectedIds, showFilter: showFilter, total: total, ...rest })=>{
    const xs = (0, $2An97$useMediaQuery)((theme)=>theme.breakpoints.down("sm"));
    const resourceDefinition = (0, $2An97$useResourceDefinition)(rest);
    return /*#__PURE__*/ (0, $2An97$jsxs)((0, $2An97$TopToolbar), {
        children: [
            /*#__PURE__*/ (0, $2An97$jsx)((0, $5a39d2966c9779bd$export$2e2bcd8739ae039), {}),
            filters && /*#__PURE__*/ (0, $2An97$react).cloneElement(filters, {
                showFilter: showFilter,
                displayedFilters: displayedFilters,
                filterValues: filterValues,
                context: "button"
            }),
            resourceDefinition.hasCreate && /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$CreateButton), {}),
            !xs && exporter !== false && /*#__PURE__*/ (0, $2An97$jsx)((0, $2An97$ExportButton), {
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
var $032ebd19dd4d05d7$export$2e2bcd8739ae039 = $032ebd19dd4d05d7$var$ListActionsWithViews;



const $5bd09179d1367bb7$var$MultiViewsList = ({ children: children, actions: actions = /*#__PURE__*/ (0, $2An97$jsx)((0, $032ebd19dd4d05d7$export$2e2bcd8739ae039), {}), views: views, ListComponent: ListComponent = (0, $2An97$List), ...otherProps })=>{
    const query = new URLSearchParams((0, $2An97$useLocation)().search);
    const initialView = query.has("view") ? query.get("view") : Object.keys(views)[0];
    const [currentView, setView] = (0, $2An97$useState)(initialView);
    return /*#__PURE__*/ (0, $2An97$jsx)((0, $4d3421bb798b6c78$export$2e2bcd8739ae039).Provider, {
        value: {
            views: views,
            currentView: currentView,
            setView: setView
        },
        children: /*#__PURE__*/ (0, $2An97$jsx)(ListComponent, {
            actions: actions,
            pagination: views[currentView].pagination,
            // Set initial values, but use the query string to change these values to avoid a complete refresh
            perPage: views[initialView].perPage,
            sort: views[initialView].sort,
            ...otherProps,
            children: views[currentView].list
        })
    });
};
var $5bd09179d1367bb7$export$2e2bcd8739ae039 = $5bd09179d1367bb7$var$MultiViewsList;







export {$a854ae8777f8f757$export$2e2bcd8739ae039 as ChipList, $e54e9a9f27806c4d$export$2e2bcd8739ae039 as GridList, $8cf7b8f98f373d84$export$2e2bcd8739ae039 as MasonryList, $5ced1203870db4f6$export$2e2bcd8739ae039 as ReferenceFilter, $5bd09179d1367bb7$export$2e2bcd8739ae039 as MultiViewsList, $032ebd19dd4d05d7$export$2e2bcd8739ae039 as ListActionsWithViews, $4d3421bb798b6c78$export$2e2bcd8739ae039 as ListViewContext, $5a39d2966c9779bd$export$2e2bcd8739ae039 as ViewsButtons};
//# sourceMappingURL=index.es.js.map
