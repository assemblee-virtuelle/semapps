var $5MILa$reactjsxruntime = require("react/jsx-runtime");
var $5MILa$react = require("react");
var $5MILa$reactadmin = require("react-admin");
var $5MILa$muimaterial = require("@mui/material");
var $5MILa$muistylesmakeStyles = require("@mui/styles/makeStyles");
var $5MILa$muiiconsmaterialAddCircle = require("@mui/icons-material/AddCircle");
var $5MILa$muiiconsmaterialLaunch = require("@mui/icons-material/Launch");
var $5MILa$semappssemanticdataprovider = require("@semapps/semantic-data-provider");
var $5MILa$reactmasonrycss = require("react-masonry-css");
var $5MILa$reactrouter = require("react-router");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "ChipList", () => $2eed9b3621f13b18$export$2e2bcd8739ae039);
$parcel$export(module.exports, "GridList", () => $a4d27c2ab268c05b$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MasonryList", () => $bc22719d52a02d2c$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ReferenceFilter", () => $696f298352ead676$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MultiViewsList", () => $8e315201c1049d3f$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ListActionsWithViews", () => $6ca83fab5dd482a0$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ListViewContext", () => $1f2a4ca7a7e2b912$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ViewsButtons", () => $2b75f3c2996d19f7$export$2e2bcd8739ae039);








const $2eed9b3621f13b18$var$useStyles = (0, ($parcel$interopDefault($5MILa$muistylesmakeStyles)))(()=>({
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
const $2eed9b3621f13b18$var$stopPropagation = (e)=>e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $2eed9b3621f13b18$var$handleClick = ()=>{};
const $2eed9b3621f13b18$var$ChipList = (props)=>{
    const { classes: classesOverride, className: className, children: children, linkType: linkType = 'edit', component: component = 'div', primaryText: primaryText, appendLink: appendLink, externalLinks: externalLinks = false, ...rest } = props;
    const { data: data, isLoading: isLoading, resource: resource } = (0, $5MILa$reactadmin.useListContext)(props);
    const getExternalLink = (0, $5MILa$semappssemanticdataprovider.useGetExternalLink)(externalLinks);
    const createPath = (0, $5MILa$reactadmin.useCreatePath)();
    const classes = $2eed9b3621f13b18$var$useStyles(props);
    const Component = component;
    if (isLoading) return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.LinearProgress), {});
    return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)(Component, {
        className: classes.root,
        ...(0, $5MILa$reactadmin.sanitizeListRestProps)(rest),
        children: [
            data.map((record)=>{
                if (!record || record._error) return null;
                const externalLink = getExternalLink(record);
                if (externalLink) return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.RecordContextProvider), {
                    value: record,
                    children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)("a", {
                        href: externalLink,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: classes.link,
                        onClick: $2eed9b3621f13b18$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.ChipField), {
                            source: primaryText,
                            className: classes.chipField,
                            color: "secondary",
                            deleteIcon: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, ($parcel$interopDefault($5MILa$muiiconsmaterialLaunch))), {
                                className: classes.launchIcon
                            }),
                            // Workaround to force ChipField to be clickable
                            onClick: $2eed9b3621f13b18$var$handleClick,
                            // Required to display the delete icon
                            onDelete: $2eed9b3621f13b18$var$handleClick
                        })
                    })
                }, record.id);
                if (linkType) return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.RecordContextProvider), {
                    value: record,
                    children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.Link), {
                        className: classes.link,
                        to: createPath({
                            resource: resource,
                            id: record.id,
                            type: linkType
                        }),
                        onClick: $2eed9b3621f13b18$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.ChipField), {
                            source: primaryText,
                            className: classes.chipField,
                            color: "secondary",
                            // Workaround to force ChipField to be clickable
                            onClick: $2eed9b3621f13b18$var$handleClick
                        })
                    })
                }, record.id);
                return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.RecordContextProvider), {
                    value: record,
                    children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.ChipField), {
                        source: primaryText,
                        className: classes.chipField,
                        color: "secondary",
                        // Workaround to force ChipField to be clickable
                        onClick: $2eed9b3621f13b18$var$handleClick
                    })
                }, record.id);
            }),
            appendLink && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, ($parcel$interopDefault($5MILa$muiiconsmaterialAddCircle))), {
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
    const { data: data, resource: resource, isLoading: isLoading } = (0, $5MILa$reactadmin.useListContext)();
    const getExternalLink = (0, $5MILa$semappssemanticdataprovider.useGetExternalLink)(externalLinks);
    const createPath = (0, $5MILa$reactadmin.useCreatePath)();
    if (isLoading || !data) return null;
    return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.Grid), {
        container: true,
        spacing: spacing,
        children: data.map((record)=>{
            if (!record || record._error) return null;
            const externalLink = getExternalLink(record);
            let child;
            if (externalLink) child = /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)("a", {
                href: externalLink,
                target: "_blank",
                rel: "noopener noreferrer",
                onClick: $a4d27c2ab268c05b$var$stopPropagation,
                children: /*#__PURE__*/ $5MILa$react.cloneElement($5MILa$react.Children.only(children), {
                    externalLink: true,
                    // Workaround to force ChipField to be clickable
                    onClick: $a4d27c2ab268c05b$var$handleClick
                })
            });
            else if (linkType) child = /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.Link), {
                to: createPath({
                    resource: resource,
                    id: record.id,
                    type: linkType
                }),
                onClick: $a4d27c2ab268c05b$var$stopPropagation,
                children: /*#__PURE__*/ $5MILa$react.cloneElement($5MILa$react.Children.only(children), {
                    // Workaround to force ChipField to be clickable
                    onClick: $a4d27c2ab268c05b$var$handleClick
                })
            });
            else child = children;
            return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.Grid), {
                item: true,
                xs: xs,
                sm: sm,
                md: md,
                lg: lg,
                xl: xl,
                children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.RecordContextProvider), {
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
    linkType: 'edit',
    externalLinks: false
};
var $a4d27c2ab268c05b$export$2e2bcd8739ae039 = $a4d27c2ab268c05b$var$GridList;








const $bc22719d52a02d2c$var$useStyles = (0, ($parcel$interopDefault($5MILa$muistylesmakeStyles)))(()=>({
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
 */ const $bc22719d52a02d2c$var$MasonryList = ({ image: image, content: content, actions: actions, breakpointCols: breakpointCols, linkType: linkType })=>{
    const classes = $bc22719d52a02d2c$var$useStyles();
    const { data: data, resource: resource } = (0, $5MILa$reactadmin.useListContext)();
    const createPath = (0, $5MILa$reactadmin.useCreatePath)();
    return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, ($parcel$interopDefault($5MILa$reactmasonrycss))), {
        breakpointCols: breakpointCols,
        className: classes.grid,
        columnClassName: classes.column,
        children: data.map((record)=>{
            if (!record || record._error) return null;
            const imageUrl = typeof image === 'function' ? image(record) : image;
            return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.RecordContextProvider), {
                value: record,
                children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)((0, $5MILa$muimaterial.Card), {
                    className: classes.card,
                    children: [
                        /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.Link), {
                            to: createPath({
                                resource: resource,
                                id: record.id,
                                type: linkType
                            }),
                            children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)((0, $5MILa$muimaterial.CardActionArea), {
                                children: [
                                    imageUrl && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.CardMedia), {
                                        className: classes.media,
                                        image: imageUrl
                                    }),
                                    content && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.CardContent), {
                                        children: content(record)
                                    })
                                ]
                            })
                        }),
                        actions && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.CardActions), {
                            children: actions.map((action)=>/*#__PURE__*/ (0, ($parcel$interopDefault($5MILa$react))).createElement(action))
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
    linkType: 'edit'
};
var $bc22719d52a02d2c$export$2e2bcd8739ae039 = $bc22719d52a02d2c$var$MasonryList;


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
const $696f298352ead676$var$toArray = (e)=>[].concat(e);
const $696f298352ead676$var$ReferenceFilterCounter = ({ source: source, id: id })=>{
    const resourceContext = (0, $5MILa$reactadmin.useResourceContext)();
    const { data: data } = (0, $5MILa$reactadmin.useGetList)(resourceContext, {
        pagination: {
            page: 1,
            perPage: Infinity
        }
    });
    return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)((0, $5MILa$reactjsxruntime.Fragment), {
        children: [
            "\xa0",
            data && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)("span", {
                className: "filter-count",
                children: `(${data.filter((d)=>$696f298352ead676$var$toArray(d[source]).includes(id)).length})`
            })
        ]
    });
};
const $696f298352ead676$var$ReferenceFilter = ({ reference: reference, source: source, inverseSource: inverseSource, limit: limit = 25, sort: sort, filter: filter, label: label, icon: icon, showCounters: showCounters = true })=>{
    const { data: data, isLoading: isLoading } = (0, $5MILa$reactadmin.useGetList)(reference, {
        pagination: {
            page: 1,
            perPage: limit
        },
        sort: sort,
        filter: filter
    });
    const currentResource = (0, $5MILa$reactadmin.useResourceDefinition)({
        resource: reference
    });
    const resourceContext = (0, $5MILa$reactadmin.useResourceContext)();
    const resourceContextContainers = (0, $5MILa$semappssemanticdataprovider.useContainers)(resourceContext);
    const { setFilters: setFilters } = (0, $5MILa$reactadmin.useListContext)();
    (0, $5MILa$react.useEffect)(()=>{
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
            return $696f298352ead676$var$toArray(itemData[inverseSource]).some((inverseSourceData)=>{
                return inverseSourceData?.startsWith(containerUrl);
            });
        });
    };
    return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.FilterList), {
        label: label || currentResource?.options?.label || '',
        icon: icon || currentResource?.icon ? /*#__PURE__*/ (0, $5MILa$react.createElement)(currentResource.icon) : undefined,
        children: data && data.filter((itemData)=>itemIsUsed(itemData)).map((itemData)=>/*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.FilterListItem), {
                label: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)("span", {
                    className: "filter-label",
                    children: [
                        itemData['pair:label'],
                        showCounters && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)($696f298352ead676$var$ReferenceFilterCounter, {
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
var $696f298352ead676$export$2e2bcd8739ae039 = $696f298352ead676$var$ReferenceFilter;















const $1f2a4ca7a7e2b912$var$ListViewContext = /*#__PURE__*/ (0, ($parcel$interopDefault($5MILa$react))).createContext({
    views: null,
    currentView: null,
    setView: ()=>null
});
var $1f2a4ca7a7e2b912$export$2e2bcd8739ae039 = $1f2a4ca7a7e2b912$var$ListViewContext;


const $2b75f3c2996d19f7$var$ViewsButtons = ()=>{
    const query = new URLSearchParams((0, $5MILa$reactrouter.useLocation)().search);
    const { views: views, currentView: currentView, setView: setView } = (0, ($parcel$interopDefault($5MILa$react))).useContext((0, $1f2a4ca7a7e2b912$export$2e2bcd8739ae039));
    return views ? Object.entries(views).filter(([key])=>key !== currentView).map(([key, view])=>{
        query.set('view', key);
        query.set('page', 1);
        query.set('perPage', view.perPage);
        if (view.sort) {
            query.set('sort', view.sort.field);
            query.set('order', view.sort.order);
        }
        return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.Link), {
            to: `?${query.toString()}`,
            children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.Button), {
                onClick: ()=>setView(key),
                label: view.label,
                children: /*#__PURE__*/ (0, ($parcel$interopDefault($5MILa$react))).createElement(view.icon)
            })
        }, key);
    }) : null;
};
var $2b75f3c2996d19f7$export$2e2bcd8739ae039 = $2b75f3c2996d19f7$var$ViewsButtons;


const $6ca83fab5dd482a0$var$ListActionsWithViews = ({ bulkActions: bulkActions, basePath: basePath, sort: sort, displayedFilters: displayedFilters, exporter: exporter, filters: filters, filterValues: filterValues, onUnselectItems: onUnselectItems, selectedIds: selectedIds, showFilter: showFilter, total: total, ...rest })=>{
    const xs = (0, $5MILa$muimaterial.useMediaQuery)((theme)=>theme.breakpoints.down('sm'));
    const resourceDefinition = (0, $5MILa$reactadmin.useResourceDefinition)(rest);
    return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)((0, $5MILa$reactadmin.TopToolbar), {
        children: [
            /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $2b75f3c2996d19f7$export$2e2bcd8739ae039), {}),
            filters && /*#__PURE__*/ (0, ($parcel$interopDefault($5MILa$react))).cloneElement(filters, {
                showFilter: showFilter,
                displayedFilters: displayedFilters,
                filterValues: filterValues,
                context: 'button'
            }),
            resourceDefinition.hasCreate && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.CreateButton), {}),
            !xs && exporter !== false && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.ExportButton), {
                disabled: total === 0,
                sort: sort,
                filter: filterValues,
                exporter: exporter
            }),
            bulkActions && /*#__PURE__*/ (0, ($parcel$interopDefault($5MILa$react))).cloneElement(bulkActions, {
                filterValues: filterValues,
                selectedIds: selectedIds,
                onUnselectItems: onUnselectItems
            })
        ]
    });
};
var $6ca83fab5dd482a0$export$2e2bcd8739ae039 = $6ca83fab5dd482a0$var$ListActionsWithViews;



const $8e315201c1049d3f$var$MultiViewsList = ({ children: children, actions: actions, views: views, ListComponent: ListComponent, ...otherProps })=>{
    const query = new URLSearchParams((0, $5MILa$reactrouter.useLocation)().search);
    const initialView = query.has('view') ? query.get('view') : Object.keys(views)[0];
    const [currentView, setView] = (0, $5MILa$react.useState)(initialView);
    return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $1f2a4ca7a7e2b912$export$2e2bcd8739ae039).Provider, {
        value: {
            views: views,
            currentView: currentView,
            setView: setView
        },
        children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)(ListComponent, {
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
    actions: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $6ca83fab5dd482a0$export$2e2bcd8739ae039), {}),
    ListComponent: (0, $5MILa$reactadmin.List)
};
var $8e315201c1049d3f$export$2e2bcd8739ae039 = $8e315201c1049d3f$var$MultiViewsList;







//# sourceMappingURL=index.cjs.js.map
