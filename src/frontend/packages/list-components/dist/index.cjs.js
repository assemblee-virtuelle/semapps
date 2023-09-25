var $1w0zd$reactjsxruntime = require("react/jsx-runtime");
var $1w0zd$react = require("react");
var $1w0zd$reactadmin = require("react-admin");
var $1w0zd$muimaterial = require("@mui/material");
var $1w0zd$muistylesmakeStyles = require("@mui/styles/makeStyles");
var $1w0zd$muiiconsmaterialAddCircle = require("@mui/icons-material/AddCircle");
var $1w0zd$muiiconsmaterialLaunch = require("@mui/icons-material/Launch");
var $1w0zd$semappssemanticdataprovider = require("@semapps/semantic-data-provider");
var $1w0zd$reactmasonrycss = require("react-masonry-css");
var $1w0zd$reactrouter = require("react-router");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "ChipList", () => $2eed9b3621f13b18$export$2e2bcd8739ae039);
$parcel$export(module.exports, "GridList", () => $a4d27c2ab268c05b$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MasonryList", () => $bc22719d52a02d2c$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ReferenceFilter", () => $c194354c4d8b3a77$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MultiViewsList", () => $8e315201c1049d3f$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ListActionsWithViews", () => $6ca83fab5dd482a0$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ListViewContext", () => $1f2a4ca7a7e2b912$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ViewsButtons", () => $2b75f3c2996d19f7$export$2e2bcd8739ae039);








const $2eed9b3621f13b18$var$useStyles = (0, ($parcel$interopDefault($1w0zd$muistylesmakeStyles)))(()=>({
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
const $2eed9b3621f13b18$var$stopPropagation = (e)=>e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $2eed9b3621f13b18$var$handleClick = ()=>{};
const $2eed9b3621f13b18$var$ChipList = (props)=>{
    const { classes: classesOverride, className: className, children: children, linkType: linkType = "edit", component: component = "div", primaryText: primaryText, appendLink: appendLink, externalLinks: externalLinks = false, ...rest } = props;
    const { data: data, isLoading: isLoading, resource: resource } = (0, $1w0zd$reactadmin.useListContext)(props);
    const getExternalLink = (0, $1w0zd$semappssemanticdataprovider.useGetExternalLink)(externalLinks);
    const createPath = (0, $1w0zd$reactadmin.useCreatePath)();
    const classes = $2eed9b3621f13b18$var$useStyles(props);
    const Component = component;
    if (isLoading) return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$muimaterial.LinearProgress), {});
    return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsxs)(Component, {
        className: classes.root,
        ...(0, $1w0zd$reactadmin.sanitizeListRestProps)(rest),
        children: [
            data.map((record)=>{
                if (!record || record._error) return null;
                const externalLink = getExternalLink(record);
                if (externalLink) return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.RecordContextProvider), {
                    value: record,
                    children: /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)("a", {
                        href: externalLink,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: classes.link,
                        onClick: $2eed9b3621f13b18$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.ChipField), {
                            source: primaryText,
                            className: classes.chipField,
                            color: "secondary",
                            deleteIcon: /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, ($parcel$interopDefault($1w0zd$muiiconsmaterialLaunch))), {
                                className: classes.launchIcon
                            }),
                            // Workaround to force ChipField to be clickable
                            onClick: $2eed9b3621f13b18$var$handleClick,
                            // Required to display the delete icon
                            onDelete: $2eed9b3621f13b18$var$handleClick
                        })
                    })
                }, record.id);
                if (linkType) return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.RecordContextProvider), {
                    value: record,
                    children: /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.Link), {
                        className: classes.link,
                        to: createPath({
                            resource: resource,
                            id: record.id,
                            type: linkType
                        }),
                        onClick: $2eed9b3621f13b18$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.ChipField), {
                            source: primaryText,
                            className: classes.chipField,
                            color: "secondary",
                            // Workaround to force ChipField to be clickable
                            onClick: $2eed9b3621f13b18$var$handleClick
                        })
                    })
                }, record.id);
                return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.RecordContextProvider), {
                    value: record,
                    children: /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.ChipField), {
                        source: primaryText,
                        className: classes.chipField,
                        color: "secondary",
                        // Workaround to force ChipField to be clickable
                        onClick: $2eed9b3621f13b18$var$handleClick
                    })
                }, record.id);
            }),
            appendLink && /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, ($parcel$interopDefault($1w0zd$muiiconsmaterialAddCircle))), {
                color: "primary",
                className: classes.addIcon,
                onClick: appendLink
            })
        ]
    });
};
var $2eed9b3621f13b18$export$2e2bcd8739ae039 = $2eed9b3621f13b18$var$ChipList;







// useful to prevent click bubbling in a datagrid with rowClick
const $a4d27c2ab268c05b$var$stopPropagation = (e)=>e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $a4d27c2ab268c05b$var$handleClick = ()=>{};
const $a4d27c2ab268c05b$var$GridList = ({ children: children, linkType: linkType, externalLinks: externalLinks, spacing: spacing, xs: xs, sm: sm, md: md, lg: lg, xl: xl })=>{
    const { data: data, resource: resource, isLoading: isLoading } = (0, $1w0zd$reactadmin.useListContext)();
    const getExternalLink = (0, $1w0zd$semappssemanticdataprovider.useGetExternalLink)(externalLinks);
    const createPath = (0, $1w0zd$reactadmin.useCreatePath)();
    if (isLoading || !data) return null;
    return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$muimaterial.Grid), {
        container: true,
        spacing: spacing,
        children: data.map((record)=>{
            if (!record || record._error) return null;
            const externalLink = getExternalLink(record);
            let child;
            if (externalLink) child = /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)("a", {
                href: externalLink,
                target: "_blank",
                rel: "noopener noreferrer",
                onClick: $a4d27c2ab268c05b$var$stopPropagation,
                children: /*#__PURE__*/ $1w0zd$react.cloneElement($1w0zd$react.Children.only(children), {
                    externalLink: true,
                    // Workaround to force ChipField to be clickable
                    onClick: $a4d27c2ab268c05b$var$handleClick
                })
            });
            else if (linkType) child = /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.Link), {
                to: createPath({
                    resource: resource,
                    id: record.id,
                    type: linkType
                }),
                onClick: $a4d27c2ab268c05b$var$stopPropagation,
                children: /*#__PURE__*/ $1w0zd$react.cloneElement($1w0zd$react.Children.only(children), {
                    // Workaround to force ChipField to be clickable
                    onClick: $a4d27c2ab268c05b$var$handleClick
                })
            });
            else child = children;
            return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$muimaterial.Grid), {
                item: true,
                xs: xs,
                sm: sm,
                md: md,
                lg: lg,
                xl: xl,
                children: /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.RecordContextProvider), {
                    value: record,
                    children: child
                })
            }, record.id);
        })
    });
};
$a4d27c2ab268c05b$var$GridList.defaultProps = {
    xs: 6,
    spacing: 3,
    linkType: "edit",
    externalLinks: false
};
var $a4d27c2ab268c05b$export$2e2bcd8739ae039 = $a4d27c2ab268c05b$var$GridList;








const $bc22719d52a02d2c$var$useStyles = (0, ($parcel$interopDefault($1w0zd$muistylesmakeStyles)))(()=>({
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
 */ const $bc22719d52a02d2c$var$MasonryList = ({ image: image, content: content, actions: actions, breakpointCols: breakpointCols, linkType: linkType })=>{
    const classes = $bc22719d52a02d2c$var$useStyles();
    const { data: data, resource: resource } = (0, $1w0zd$reactadmin.useListContext)();
    const createPath = (0, $1w0zd$reactadmin.useCreatePath)();
    return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, ($parcel$interopDefault($1w0zd$reactmasonrycss))), {
        breakpointCols: breakpointCols,
        className: classes.grid,
        columnClassName: classes.column,
        children: data.map((record)=>{
            if (!record || record._error) return null;
            const imageUrl = typeof image === "function" ? image(record) : image;
            return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.RecordContextProvider), {
                value: record,
                children: /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsxs)((0, $1w0zd$muimaterial.Card), {
                    className: classes.card,
                    children: [
                        /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.Link), {
                            to: createPath({
                                resource: resource,
                                id: record.id,
                                type: linkType
                            }),
                            children: /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsxs)((0, $1w0zd$muimaterial.CardActionArea), {
                                children: [
                                    imageUrl && /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$muimaterial.CardMedia), {
                                        className: classes.media,
                                        image: imageUrl
                                    }),
                                    content && /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$muimaterial.CardContent), {
                                        children: content(record)
                                    })
                                ]
                            })
                        }),
                        actions && /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$muimaterial.CardActions), {
                            children: actions.map((action)=>/*#__PURE__*/ (0, ($parcel$interopDefault($1w0zd$react))).createElement(action))
                        })
                    ]
                }, record.id)
            });
        })
    });
};
$bc22719d52a02d2c$var$MasonryList.defaultProps = {
    breakpointCols: {
        default: 3,
        1050: 2,
        700: 1
    },
    linkType: "edit"
};
var $bc22719d52a02d2c$export$2e2bcd8739ae039 = $bc22719d52a02d2c$var$MasonryList;






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
 */ const $c194354c4d8b3a77$var$ReferenceFilterCounter = ({ source: source, id: id })=>{
    const resourceContext = (0, $1w0zd$reactadmin.useResourceContext)();
    const { data: data, isLoading: isLoading } = (0, $1w0zd$reactadmin.useGetList)(resourceContext);
    return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsxs)((0, $1w0zd$reactjsxruntime.Fragment), {
        children: [
            "\xa0",
            !isLoading && /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)("span", {
                className: "filter-count",
                children: `(${Object.values(data).filter((d)=>[].concat(d[source]).includes(id)).length})`
            })
        ]
    });
};
const $c194354c4d8b3a77$var$ReferenceFilter = ({ reference: reference, source: source, inverseSource: inverseSource, limit: limit, sort: sort, filter: filter, label: label, icon: icon, showCounters: showCounters })=>{
    const { data: data, isLoading: isLoading } = (0, $1w0zd$reactadmin.useGetList)(reference, {
        page: 1,
        perPage: limit
    }, sort, filter);
    const currentResource = (0, $1w0zd$reactadmin.useResourceDefinition)({
        resource: reference
    });
    const resourceContext = (0, $1w0zd$reactadmin.useResourceContext)();
    const resourceContextDataModel = (0, $1w0zd$semappssemanticdataprovider.useDataModel)(resourceContext);
    const resourceContextContainers = (0, $1w0zd$semappssemanticdataprovider.useContainers)(resourceContext);
    const { displayedFilters: displayedFilters, filterValues: filterValues, setFilters: setFilters, hideFilter: hideFilter } = (0, $1w0zd$reactadmin.useListContext)();
    (0, $1w0zd$react.useEffect)(()=>{
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
    return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.FilterList), {
        label: label || currentResource?.options?.label || "",
        icon: icon || currentResource?.icon ? /*#__PURE__*/ (0, ($parcel$interopDefault($1w0zd$react))).createElement(currentResource.icon) : undefined,
        children: data && data.filter((itemData)=>itemIsUsed(itemData)).map((itemData)=>/*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.FilterListItem), {
                label: /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsxs)("span", {
                    className: "filter-label",
                    children: [
                        itemData["pair:label"],
                        showCounters && /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)($c194354c4d8b3a77$var$ReferenceFilterCounter, {
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
$c194354c4d8b3a77$var$ReferenceFilter.defaultProps = {
    limit: 25,
    showCounters: true
};
var $c194354c4d8b3a77$export$2e2bcd8739ae039 = $c194354c4d8b3a77$var$ReferenceFilter;















const $1f2a4ca7a7e2b912$var$ListViewContext = /*#__PURE__*/ (0, ($parcel$interopDefault($1w0zd$react))).createContext({
    views: null,
    currentView: null,
    setView: ()=>null
});
var $1f2a4ca7a7e2b912$export$2e2bcd8739ae039 = $1f2a4ca7a7e2b912$var$ListViewContext;


const $2b75f3c2996d19f7$var$ViewsButtons = ()=>{
    const query = new URLSearchParams((0, $1w0zd$reactrouter.useLocation)().search);
    const { views: views, currentView: currentView, setView: setView } = (0, ($parcel$interopDefault($1w0zd$react))).useContext((0, $1f2a4ca7a7e2b912$export$2e2bcd8739ae039));
    return views ? Object.entries(views).filter(([key])=>key !== currentView).map(([key, view])=>{
        query.set("view", key);
        query.set("page", 1);
        query.set("perPage", view.perPage);
        if (view.sort) {
            query.set("sort", view.sort.field);
            query.set("order", view.sort.order);
        }
        return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.Link), {
            to: `?${query.toString()}`,
            children: /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.Button), {
                onClick: ()=>setView(key),
                label: view.label,
                children: /*#__PURE__*/ (0, ($parcel$interopDefault($1w0zd$react))).createElement(view.icon)
            })
        }, key);
    }) : null;
};
var $2b75f3c2996d19f7$export$2e2bcd8739ae039 = $2b75f3c2996d19f7$var$ViewsButtons;


const $6ca83fab5dd482a0$var$ListActionsWithViews = ({ bulkActions: bulkActions, basePath: basePath, sort: sort, displayedFilters: displayedFilters, exporter: exporter, filters: filters, filterValues: filterValues, onUnselectItems: onUnselectItems, selectedIds: selectedIds, showFilter: showFilter, total: total, ...rest })=>{
    const xs = (0, $1w0zd$muimaterial.useMediaQuery)((theme)=>theme.breakpoints.down("sm"));
    const resourceDefinition = (0, $1w0zd$reactadmin.useResourceDefinition)(rest);
    return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsxs)((0, $1w0zd$reactadmin.TopToolbar), {
        children: [
            /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $2b75f3c2996d19f7$export$2e2bcd8739ae039), {}),
            filters && /*#__PURE__*/ (0, ($parcel$interopDefault($1w0zd$react))).cloneElement(filters, {
                showFilter: showFilter,
                displayedFilters: displayedFilters,
                filterValues: filterValues,
                context: "button"
            }),
            resourceDefinition.hasCreate && /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.CreateButton), {}),
            !xs && exporter !== false && /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1w0zd$reactadmin.ExportButton), {
                disabled: total === 0,
                sort: sort,
                filter: filterValues,
                exporter: exporter
            }),
            bulkActions && /*#__PURE__*/ (0, ($parcel$interopDefault($1w0zd$react))).cloneElement(bulkActions, {
                filterValues: filterValues,
                selectedIds: selectedIds,
                onUnselectItems: onUnselectItems
            })
        ]
    });
};
var $6ca83fab5dd482a0$export$2e2bcd8739ae039 = $6ca83fab5dd482a0$var$ListActionsWithViews;



const $8e315201c1049d3f$var$MultiViewsList = ({ children: children, actions: actions, views: views, ListComponent: ListComponent, ...otherProps })=>{
    const query = new URLSearchParams((0, $1w0zd$reactrouter.useLocation)().search);
    const initialView = query.has("view") ? query.get("view") : Object.keys(views)[0];
    const [currentView, setView] = (0, $1w0zd$react.useState)(initialView);
    return /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $1f2a4ca7a7e2b912$export$2e2bcd8739ae039).Provider, {
        value: {
            views: views,
            currentView: currentView,
            setView: setView
        },
        children: /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)(ListComponent, {
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
$8e315201c1049d3f$var$MultiViewsList.defaultProps = {
    actions: /*#__PURE__*/ (0, $1w0zd$reactjsxruntime.jsx)((0, $6ca83fab5dd482a0$export$2e2bcd8739ae039), {}),
    ListComponent: (0, $1w0zd$reactadmin.List)
};
var $8e315201c1049d3f$export$2e2bcd8739ae039 = $8e315201c1049d3f$var$MultiViewsList;







//# sourceMappingURL=index.cjs.js.map
