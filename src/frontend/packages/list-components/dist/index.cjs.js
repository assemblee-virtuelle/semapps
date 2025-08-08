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

$parcel$export(module.exports, "ChipList", () => $a973de69cdff0648$export$2e2bcd8739ae039);
$parcel$export(module.exports, "GridList", () => $5a120b619addcf4f$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MasonryList", () => $160200afc5f7ef6a$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ReferenceFilter", () => $696f298352ead676$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MultiViewsList", () => $c68bc4bb58b70b47$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ListActionsWithViews", () => $b542b76f527e6cda$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ListViewContext", () => $2cb4231e0b7a599d$export$2e2bcd8739ae039);
$parcel$export(module.exports, "ViewsButtons", () => $a87c7903c3d176d8$export$2e2bcd8739ae039);








const $a973de69cdff0648$var$useStyles = (0, ($parcel$interopDefault($5MILa$muistylesmakeStyles)))(()=>({
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
const $a973de69cdff0648$var$stopPropagation = (e)=>e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $a973de69cdff0648$var$handleClick = ()=>{};
const $a973de69cdff0648$var$ChipList = (props)=>{
    const { classes: classesOverride, className: className, children: children, linkType: linkType = 'edit', component: component = 'div', primaryText: primaryText, appendLink: appendLink, externalLinks: externalLinks = false, ...rest } = props;
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
    const { data: data, isLoading: isLoading, resource: resource } = (0, $5MILa$reactadmin.useListContext)(props);
    const getExternalLink = (0, $5MILa$semappssemanticdataprovider.useGetExternalLink)(externalLinks);
    const createPath = (0, $5MILa$reactadmin.useCreatePath)();
    // @ts-expect-error TS(2349): This expression is not callable.
    const classes = $a973de69cdff0648$var$useStyles(props);
    const Component = component;
    if (isLoading) return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.LinearProgress), {});
    return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)(Component, {
        className: classes.root,
        ...(0, $5MILa$reactadmin.sanitizeListRestProps)(rest),
        children: [
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
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
                        onClick: $a973de69cdff0648$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.ChipField), {
                            source: primaryText,
                            className: classes.chipField,
                            color: "secondary",
                            deleteIcon: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, ($parcel$interopDefault($5MILa$muiiconsmaterialLaunch))), {
                                className: classes.launchIcon
                            }),
                            // Workaround to force ChipField to be clickable
                            onClick: $a973de69cdff0648$var$handleClick,
                            // Required to display the delete icon
                            onDelete: $a973de69cdff0648$var$handleClick
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
                        onClick: $a973de69cdff0648$var$stopPropagation,
                        children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.ChipField), {
                            source: primaryText,
                            className: classes.chipField,
                            color: "secondary",
                            // Workaround to force ChipField to be clickable
                            onClick: $a973de69cdff0648$var$handleClick
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
                        onClick: $a973de69cdff0648$var$handleClick
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
var $a973de69cdff0648$export$2e2bcd8739ae039 = $a973de69cdff0648$var$ChipList;







// useful to prevent click bubbling in a datagrid with rowClick
const $5a120b619addcf4f$var$stopPropagation = (e)=>e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $5a120b619addcf4f$var$handleClick = ()=>{};
const $5a120b619addcf4f$var$GridList = ({ children: children, linkType: linkType = 'edit', externalLinks: externalLinks = false, spacing: spacing = 3, xs: xs = 6, sm: sm, md: md, lg: lg, xl: xl })=>{
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
                onClick: $5a120b619addcf4f$var$stopPropagation,
                children: /*#__PURE__*/ $5MILa$react.cloneElement($5MILa$react.Children.only(children), {
                    externalLink: true,
                    // Workaround to force ChipField to be clickable
                    onClick: $5a120b619addcf4f$var$handleClick
                })
            });
            else if (linkType) child = /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.Link), {
                to: createPath({
                    resource: resource,
                    id: record.id,
                    type: linkType
                }),
                onClick: $5a120b619addcf4f$var$stopPropagation,
                children: /*#__PURE__*/ $5MILa$react.cloneElement($5MILa$react.Children.only(children), {
                    // Workaround to force ChipField to be clickable
                    onClick: $5a120b619addcf4f$var$handleClick
                })
            });
            else child = children;
            return(// @ts-expect-error TS(2769): No overload matches this call.
            /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.Grid), {
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
            }, record.id));
        })
    });
};
var $5a120b619addcf4f$export$2e2bcd8739ae039 = $5a120b619addcf4f$var$GridList;








const $160200afc5f7ef6a$var$useStyles = (0, ($parcel$interopDefault($5MILa$muistylesmakeStyles)))(()=>({
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
 */ const $160200afc5f7ef6a$var$MasonryList = ({ image: image, content: content, actions: actions, breakpointCols: breakpointCols = {
    default: 3,
    1050: 2,
    700: 1
}, linkType: linkType = 'edit' })=>{
    // @ts-expect-error TS(2349): This expression is not callable.
    const classes = $160200afc5f7ef6a$var$useStyles();
    const { data: data, resource: resource } = (0, $5MILa$reactadmin.useListContext)();
    const createPath = (0, $5MILa$reactadmin.useCreatePath)();
    return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, ($parcel$interopDefault($5MILa$reactmasonrycss))), {
        breakpointCols: breakpointCols,
        className: classes.grid,
        columnClassName: classes.column,
        children: // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        data.map((record)=>{
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
var $160200afc5f7ef6a$export$2e2bcd8739ae039 = $160200afc5f7ef6a$var$MasonryList;


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
    // @ts-expect-error TS(2345): Argument of type 'ResourceContextValue' is not ass... Remove this comment to see the full error message
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















const $2cb4231e0b7a599d$var$ListViewContext = (0, ($parcel$interopDefault($5MILa$react))).createContext({
    views: null,
    currentView: null,
    setView: ()=>null
});
var $2cb4231e0b7a599d$export$2e2bcd8739ae039 = $2cb4231e0b7a599d$var$ListViewContext;


const $a87c7903c3d176d8$var$ViewsButtons = ()=>{
    const query = new URLSearchParams((0, $5MILa$reactrouter.useLocation)().search);
    const { views: views, currentView: currentView, setView: setView } = (0, ($parcel$interopDefault($5MILa$react))).useContext((0, $2cb4231e0b7a599d$export$2e2bcd8739ae039));
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
        return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.Link), {
            to: `?${query.toString()}`,
            children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.Button), {
                // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                onClick: ()=>setView(key),
                // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                label: view.label,
                children: // @ts-expect-error TS(2571): Object is of type 'unknown'.
                /*#__PURE__*/ (0, ($parcel$interopDefault($5MILa$react))).createElement(view.icon)
            })
        }, key);
    }) : null;
};
var $a87c7903c3d176d8$export$2e2bcd8739ae039 = $a87c7903c3d176d8$var$ViewsButtons;


const $b542b76f527e6cda$var$ListActionsWithViews = ({ bulkActions: bulkActions, basePath: basePath, sort: sort, displayedFilters: displayedFilters, exporter: exporter, filters: filters, filterValues: filterValues, onUnselectItems: onUnselectItems, selectedIds: selectedIds, showFilter: showFilter, total: total, ...rest })=>{
    const xs = (0, $5MILa$muimaterial.useMediaQuery)((theme)=>theme.breakpoints.down('sm'));
    const resourceDefinition = (0, $5MILa$reactadmin.useResourceDefinition)(rest);
    return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)((0, $5MILa$reactadmin.TopToolbar), {
        children: [
            /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $a87c7903c3d176d8$export$2e2bcd8739ae039), {}),
            filters && /*#__PURE__*/ (0, ($parcel$interopDefault($5MILa$react))).cloneElement(filters, {
                showFilter: showFilter,
                displayedFilters: displayedFilters,
                filterValues: filterValues,
                context: 'button'
            }),
            resourceDefinition.hasCreate && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.CreateButton), {}),
            !xs && exporter !== false && // @ts-expect-error TS(2322): Type '{ disabled: boolean; sort: any; filter: any;... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.ExportButton), {
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
var $b542b76f527e6cda$export$2e2bcd8739ae039 = $b542b76f527e6cda$var$ListActionsWithViews;



const $c68bc4bb58b70b47$var$MultiViewsList = ({ children: children, actions: actions = /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $b542b76f527e6cda$export$2e2bcd8739ae039), {}), views: views, ListComponent: ListComponent = (0, $5MILa$reactadmin.List), ...otherProps })=>{
    const query = new URLSearchParams((0, $5MILa$reactrouter.useLocation)().search);
    const initialView = query.has('view') ? query.get('view') : Object.keys(views)[0];
    const [currentView, setView] = (0, $5MILa$react.useState)(initialView);
    return(// @ts-expect-error TS(2322): Type 'string | null' is not assignable to type 'nu... Remove this comment to see the full error message
    /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $2cb4231e0b7a599d$export$2e2bcd8739ae039).Provider, {
        value: {
            views: views,
            currentView: currentView,
            setView: setView
        },
        children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)(ListComponent, {
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
var $c68bc4bb58b70b47$export$2e2bcd8739ae039 = $c68bc4bb58b70b47$var$MultiViewsList;







//# sourceMappingURL=index.cjs.js.map
