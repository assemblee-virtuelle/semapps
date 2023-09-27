import {jsx as $3uY0S$jsx, jsxs as $3uY0S$jsxs, Fragment as $3uY0S$Fragment} from "react/jsx-runtime";
import $3uY0S$react, {cloneElement as $3uY0S$cloneElement, Children as $3uY0S$Children, useEffect as $3uY0S$useEffect, useState as $3uY0S$useState} from "react";
import {useListContext as $3uY0S$useListContext, useCreatePath as $3uY0S$useCreatePath, sanitizeListRestProps as $3uY0S$sanitizeListRestProps, RecordContextProvider as $3uY0S$RecordContextProvider, ChipField as $3uY0S$ChipField, Link as $3uY0S$Link, useResourceContext as $3uY0S$useResourceContext, useGetList as $3uY0S$useGetList, useResourceDefinition as $3uY0S$useResourceDefinition, FilterList as $3uY0S$FilterList, FilterListItem as $3uY0S$FilterListItem, List as $3uY0S$List, TopToolbar as $3uY0S$TopToolbar, CreateButton as $3uY0S$CreateButton, ExportButton as $3uY0S$ExportButton, Button as $3uY0S$Button} from "react-admin";
import {LinearProgress as $3uY0S$LinearProgress, Grid as $3uY0S$Grid, Card as $3uY0S$Card, CardActionArea as $3uY0S$CardActionArea, CardMedia as $3uY0S$CardMedia, CardContent as $3uY0S$CardContent, CardActions as $3uY0S$CardActions, useMediaQuery as $3uY0S$useMediaQuery} from "@mui/material";
import $3uY0S$muistylesmakeStyles from "@mui/styles/makeStyles";
import $3uY0S$muiiconsmaterialAddCircle from "@mui/icons-material/AddCircle";
import $3uY0S$muiiconsmaterialLaunch from "@mui/icons-material/Launch";
import {useGetExternalLink as $3uY0S$useGetExternalLink, useDataModel as $3uY0S$useDataModel, useContainers as $3uY0S$useContainers} from "@semapps/semantic-data-provider";
import $3uY0S$reactmasonrycss from "react-masonry-css";
import {useLocation as $3uY0S$useLocation} from "react-router";









const $a854ae8777f8f757$var$useStyles = (0, $3uY0S$muistylesmakeStyles)(()=>({
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
    const { data: data, isLoading: isLoading, resource: resource } = (0, $3uY0S$useListContext)(props);
    const getExternalLink = (0, $3uY0S$useGetExternalLink)(externalLinks);
    const createPath = (0, $3uY0S$useCreatePath)();
    const classes = $a854ae8777f8f757$var$useStyles(props);
    const Component = component;
    if (isLoading) return /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$LinearProgress), {});
    return /*#__PURE__*/ (0, $3uY0S$jsxs)(Component, {
        className: classes.root,
        ...(0, $3uY0S$sanitizeListRestProps)(rest),
        children: [
            data.map((record)=>{
                if (!record || record._error) return null;
                const externalLink = getExternalLink(record);
                if (externalLink) return /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$RecordContextProvider), {
                    value: record,
                    children: /*#__PURE__*/ (0, $3uY0S$jsx)("a", {
                        href: externalLink,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: classes.link,
                        onClick: $a854ae8777f8f757$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$ChipField), {
                            source: primaryText,
                            className: classes.chipField,
                            color: "secondary",
                            deleteIcon: /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$muiiconsmaterialLaunch), {
                                className: classes.launchIcon
                            }),
                            // Workaround to force ChipField to be clickable
                            onClick: $a854ae8777f8f757$var$handleClick,
                            // Required to display the delete icon
                            onDelete: $a854ae8777f8f757$var$handleClick
                        })
                    })
                }, record.id);
                if (linkType) return /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$RecordContextProvider), {
                    value: record,
                    children: /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$Link), {
                        className: classes.link,
                        to: createPath({
                            resource: resource,
                            id: record.id,
                            type: linkType
                        }),
                        onClick: $a854ae8777f8f757$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$ChipField), {
                            source: primaryText,
                            className: classes.chipField,
                            color: "secondary",
                            // Workaround to force ChipField to be clickable
                            onClick: $a854ae8777f8f757$var$handleClick
                        })
                    })
                }, record.id);
                return /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$RecordContextProvider), {
                    value: record,
                    children: /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$ChipField), {
                        source: primaryText,
                        className: classes.chipField,
                        color: "secondary",
                        // Workaround to force ChipField to be clickable
                        onClick: $a854ae8777f8f757$var$handleClick
                    })
                }, record.id);
            }),
            appendLink && /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$muiiconsmaterialAddCircle), {
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
const $e54e9a9f27806c4d$var$GridList = ({ children: children, linkType: linkType, externalLinks: externalLinks, spacing: spacing, xs: xs, sm: sm, md: md, lg: lg, xl: xl })=>{
    const { data: data, resource: resource, isLoading: isLoading } = (0, $3uY0S$useListContext)();
    const getExternalLink = (0, $3uY0S$useGetExternalLink)(externalLinks);
    const createPath = (0, $3uY0S$useCreatePath)();
    if (isLoading || !data) return null;
    return /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$Grid), {
        container: true,
        spacing: spacing,
        children: data.map((record)=>{
            if (!record || record._error) return null;
            const externalLink = getExternalLink(record);
            let child;
            if (externalLink) child = /*#__PURE__*/ (0, $3uY0S$jsx)("a", {
                href: externalLink,
                target: "_blank",
                rel: "noopener noreferrer",
                onClick: $e54e9a9f27806c4d$var$stopPropagation,
                children: /*#__PURE__*/ $3uY0S$cloneElement($3uY0S$Children.only(children), {
                    externalLink: true,
                    // Workaround to force ChipField to be clickable
                    onClick: $e54e9a9f27806c4d$var$handleClick
                })
            });
            else if (linkType) child = /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$Link), {
                to: createPath({
                    resource: resource,
                    id: record.id,
                    type: linkType
                }),
                onClick: $e54e9a9f27806c4d$var$stopPropagation,
                children: /*#__PURE__*/ $3uY0S$cloneElement($3uY0S$Children.only(children), {
                    // Workaround to force ChipField to be clickable
                    onClick: $e54e9a9f27806c4d$var$handleClick
                })
            });
            else child = children;
            return /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$Grid), {
                item: true,
                xs: xs,
                sm: sm,
                md: md,
                lg: lg,
                xl: xl,
                children: /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$RecordContextProvider), {
                    value: record,
                    children: child
                })
            }, record.id);
        })
    });
};
$e54e9a9f27806c4d$var$GridList.defaultProps = {
    xs: 6,
    spacing: 3,
    linkType: "edit",
    externalLinks: false
};
var $e54e9a9f27806c4d$export$2e2bcd8739ae039 = $e54e9a9f27806c4d$var$GridList;








const $8cf7b8f98f373d84$var$useStyles = (0, $3uY0S$muistylesmakeStyles)(()=>({
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
 */ const $8cf7b8f98f373d84$var$MasonryList = ({ image: image, content: content, actions: actions, breakpointCols: breakpointCols, linkType: linkType })=>{
    const classes = $8cf7b8f98f373d84$var$useStyles();
    const { data: data, resource: resource } = (0, $3uY0S$useListContext)();
    const createPath = (0, $3uY0S$useCreatePath)();
    return /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$reactmasonrycss), {
        breakpointCols: breakpointCols,
        className: classes.grid,
        columnClassName: classes.column,
        children: data.map((record)=>{
            if (!record || record._error) return null;
            const imageUrl = typeof image === "function" ? image(record) : image;
            return /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$RecordContextProvider), {
                value: record,
                children: /*#__PURE__*/ (0, $3uY0S$jsxs)((0, $3uY0S$Card), {
                    className: classes.card,
                    children: [
                        /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$Link), {
                            to: createPath({
                                resource: resource,
                                id: record.id,
                                type: linkType
                            }),
                            children: /*#__PURE__*/ (0, $3uY0S$jsxs)((0, $3uY0S$CardActionArea), {
                                children: [
                                    imageUrl && /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$CardMedia), {
                                        className: classes.media,
                                        image: imageUrl
                                    }),
                                    content && /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$CardContent), {
                                        children: content(record)
                                    })
                                ]
                            })
                        }),
                        actions && /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$CardActions), {
                            children: actions.map((action)=>/*#__PURE__*/ (0, $3uY0S$react).createElement(action))
                        })
                    ]
                }, record.id)
            });
        })
    });
};
$8cf7b8f98f373d84$var$MasonryList.defaultProps = {
    breakpointCols: {
        default: 3,
        1050: 2,
        700: 1
    },
    linkType: "edit"
};
var $8cf7b8f98f373d84$export$2e2bcd8739ae039 = $8cf7b8f98f373d84$var$MasonryList;






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
 */ const $68130c000e57b305$var$ReferenceFilterCounter = ({ source: source, id: id })=>{
    const resourceContext = (0, $3uY0S$useResourceContext)();
    const { data: data, isLoading: isLoading } = (0, $3uY0S$useGetList)(resourceContext);
    return /*#__PURE__*/ (0, $3uY0S$jsxs)((0, $3uY0S$Fragment), {
        children: [
            "\xa0",
            !isLoading && /*#__PURE__*/ (0, $3uY0S$jsx)("span", {
                className: "filter-count",
                children: `(${Object.values(data).filter((d)=>[].concat(d[source]).includes(id)).length})`
            })
        ]
    });
};
const $68130c000e57b305$var$ReferenceFilter = ({ reference: reference, source: source, inverseSource: inverseSource, limit: limit, sort: sort, filter: filter, label: label, icon: icon, showCounters: showCounters })=>{
    const { data: data, isLoading: isLoading } = (0, $3uY0S$useGetList)(reference, {
        page: 1,
        perPage: limit
    }, sort, filter);
    const currentResource = (0, $3uY0S$useResourceDefinition)({
        resource: reference
    });
    const resourceContext = (0, $3uY0S$useResourceContext)();
    const resourceContextDataModel = (0, $3uY0S$useDataModel)(resourceContext);
    const resourceContextContainers = (0, $3uY0S$useContainers)(resourceContext);
    const { displayedFilters: displayedFilters, filterValues: filterValues, setFilters: setFilters, hideFilter: hideFilter } = (0, $3uY0S$useListContext)();
    (0, $3uY0S$useEffect)(()=>{
        // Needed when filter item is active and its last relation is removed
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        if (!params.filter && !isLoading) setFilters({});
    }, []);
    const itemIsUsed = (itemData)=>{
        if (!inverseSource) return true;
        if (!resourceContextContainers || !itemData) return false;
        let itemIsUsed = false;
        Object.values(resourceContextContainers).forEach((value)=>{
            value.forEach((containerUrl)=>{
                [].concat(itemData[inverseSource]).forEach((inverseSourceData)=>{
                    if (inverseSourceData?.startsWith(containerUrl)) itemIsUsed = true;
                });
            });
        });
        return itemIsUsed;
    };
    return /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$FilterList), {
        label: label || currentResource?.options?.label || "",
        icon: icon || currentResource?.icon ? /*#__PURE__*/ (0, $3uY0S$react).createElement(currentResource.icon) : undefined,
        children: data && data.filter((itemData)=>itemIsUsed(itemData)).map((itemData)=>/*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$FilterListItem), {
                label: /*#__PURE__*/ (0, $3uY0S$jsxs)("span", {
                    className: "filter-label",
                    children: [
                        itemData["pair:label"],
                        showCounters && /*#__PURE__*/ (0, $3uY0S$jsx)($68130c000e57b305$var$ReferenceFilterCounter, {
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
$68130c000e57b305$var$ReferenceFilter.defaultProps = {
    limit: 25,
    showCounters: true
};
var $68130c000e57b305$export$2e2bcd8739ae039 = $68130c000e57b305$var$ReferenceFilter;















const $4d3421bb798b6c78$var$ListViewContext = /*#__PURE__*/ (0, $3uY0S$react).createContext({
    views: null,
    currentView: null,
    setView: ()=>null
});
var $4d3421bb798b6c78$export$2e2bcd8739ae039 = $4d3421bb798b6c78$var$ListViewContext;


const $5a39d2966c9779bd$var$ViewsButtons = ()=>{
    const query = new URLSearchParams((0, $3uY0S$useLocation)().search);
    const { views: views, currentView: currentView, setView: setView } = (0, $3uY0S$react).useContext((0, $4d3421bb798b6c78$export$2e2bcd8739ae039));
    return views ? Object.entries(views).filter(([key])=>key !== currentView).map(([key, view])=>{
        query.set("view", key);
        query.set("page", 1);
        query.set("perPage", view.perPage);
        if (view.sort) {
            query.set("sort", view.sort.field);
            query.set("order", view.sort.order);
        }
        return /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$Link), {
            to: `?${query.toString()}`,
            children: /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$Button), {
                onClick: ()=>setView(key),
                label: view.label,
                children: /*#__PURE__*/ (0, $3uY0S$react).createElement(view.icon)
            })
        }, key);
    }) : null;
};
var $5a39d2966c9779bd$export$2e2bcd8739ae039 = $5a39d2966c9779bd$var$ViewsButtons;


const $032ebd19dd4d05d7$var$ListActionsWithViews = ({ bulkActions: bulkActions, basePath: basePath, sort: sort, displayedFilters: displayedFilters, exporter: exporter, filters: filters, filterValues: filterValues, onUnselectItems: onUnselectItems, selectedIds: selectedIds, showFilter: showFilter, total: total, ...rest })=>{
    const xs = (0, $3uY0S$useMediaQuery)((theme)=>theme.breakpoints.down("sm"));
    const resourceDefinition = (0, $3uY0S$useResourceDefinition)(rest);
    return /*#__PURE__*/ (0, $3uY0S$jsxs)((0, $3uY0S$TopToolbar), {
        children: [
            /*#__PURE__*/ (0, $3uY0S$jsx)((0, $5a39d2966c9779bd$export$2e2bcd8739ae039), {}),
            filters && /*#__PURE__*/ (0, $3uY0S$react).cloneElement(filters, {
                showFilter: showFilter,
                displayedFilters: displayedFilters,
                filterValues: filterValues,
                context: "button"
            }),
            resourceDefinition.hasCreate && /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$CreateButton), {}),
            !xs && exporter !== false && /*#__PURE__*/ (0, $3uY0S$jsx)((0, $3uY0S$ExportButton), {
                disabled: total === 0,
                sort: sort,
                filter: filterValues,
                exporter: exporter
            }),
            bulkActions && /*#__PURE__*/ (0, $3uY0S$react).cloneElement(bulkActions, {
                filterValues: filterValues,
                selectedIds: selectedIds,
                onUnselectItems: onUnselectItems
            })
        ]
    });
};
var $032ebd19dd4d05d7$export$2e2bcd8739ae039 = $032ebd19dd4d05d7$var$ListActionsWithViews;



const $5bd09179d1367bb7$var$MultiViewsList = ({ children: children, actions: actions, views: views, ListComponent: ListComponent, ...otherProps })=>{
    const query = new URLSearchParams((0, $3uY0S$useLocation)().search);
    const initialView = query.has("view") ? query.get("view") : Object.keys(views)[0];
    const [currentView, setView] = (0, $3uY0S$useState)(initialView);
    return /*#__PURE__*/ (0, $3uY0S$jsx)((0, $4d3421bb798b6c78$export$2e2bcd8739ae039).Provider, {
        value: {
            views: views,
            currentView: currentView,
            setView: setView
        },
        children: /*#__PURE__*/ (0, $3uY0S$jsx)(ListComponent, {
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
$5bd09179d1367bb7$var$MultiViewsList.defaultProps = {
    actions: /*#__PURE__*/ (0, $3uY0S$jsx)((0, $032ebd19dd4d05d7$export$2e2bcd8739ae039), {}),
    ListComponent: (0, $3uY0S$List)
};
var $5bd09179d1367bb7$export$2e2bcd8739ae039 = $5bd09179d1367bb7$var$MultiViewsList;







export {$a854ae8777f8f757$export$2e2bcd8739ae039 as ChipList, $e54e9a9f27806c4d$export$2e2bcd8739ae039 as GridList, $8cf7b8f98f373d84$export$2e2bcd8739ae039 as MasonryList, $68130c000e57b305$export$2e2bcd8739ae039 as ReferenceFilter, $5bd09179d1367bb7$export$2e2bcd8739ae039 as MultiViewsList, $032ebd19dd4d05d7$export$2e2bcd8739ae039 as ListActionsWithViews, $4d3421bb798b6c78$export$2e2bcd8739ae039 as ListViewContext, $5a39d2966c9779bd$export$2e2bcd8739ae039 as ViewsButtons};
//# sourceMappingURL=index.es.js.map
