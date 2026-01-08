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


function $parcel$export(e: any, n: any, v: any, s: any) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a: any) {
  return a && a.__esModule ? a.default : a;
}

// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "ChipList", () => $2eed9b3621f13b18$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "GridList", () => $a4d27c2ab268c05b$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "MasonryList", () => $bc22719d52a02d2c$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "ReferenceFilter", () => $696f298352ead676$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "MultiViewsList", () => $8e315201c1049d3f$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "ListActionsWithViews", () => $6ca83fab5dd482a0$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "ListViewContext", () => $1f2a4ca7a7e2b912$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "ViewsButtons", () => $2b75f3c2996d19f7$export$2e2bcd8739ae039);








// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
const $2eed9b3621f13b18$var$stopPropagation = (e: any) => e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $2eed9b3621f13b18$var$handleClick = ()=>{};
const $2eed9b3621f13b18$var$ChipList = (props: any) => {
    const { classes: classesOverride, className: className, children: children, linkType: linkType = 'edit', component: component = 'div', primaryText: primaryText, appendLink: appendLink, externalLinks: externalLinks = false, ...rest } = props;
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { data: data, isLoading: isLoading, resource: resource } = (0, $5MILa$reactadmin.useListContext)(props);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const getExternalLink = (0, $5MILa$semappssemanticdataprovider.useGetExternalLink)(externalLinks);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const createPath = (0, $5MILa$reactadmin.useCreatePath)();
    const classes = $2eed9b3621f13b18$var$useStyles(props);
    const Component = component;
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    if (isLoading) return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.LinearProgress), {});
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)(Component, {
            className: classes.root,
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            ...(0, $5MILa$reactadmin.sanitizeListRestProps)(rest),
            children: [
                data.map((record: any) => {
                    if (!record || record._error) return null;
                    const externalLink = getExternalLink(record);
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    if (externalLink) return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.RecordContextProvider), {
                        value: record,
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)("a", {
                            href: externalLink,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: classes.link,
                            onClick: $2eed9b3621f13b18$var$stopPropagation,
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.ChipField), {
                                source: primaryText,
                                className: classes.chipField,
                                color: "secondary",
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    if (linkType) return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.RecordContextProvider), {
                        value: record,
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.Link), {
                            className: classes.link,
                            to: createPath({
                                resource: resource,
                                id: record.id,
                                type: linkType
                            }),
                            onClick: $2eed9b3621f13b18$var$stopPropagation,
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.ChipField), {
                                source: primaryText,
                                className: classes.chipField,
                                color: "secondary",
                                // Workaround to force ChipField to be clickable
                                onClick: $2eed9b3621f13b18$var$handleClick
                            })
                        })
                    }, record.id);
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.RecordContextProvider), {
                        value: record,
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.ChipField), {
                            source: primaryText,
                            className: classes.chipField,
                            color: "secondary",
                            // Workaround to force ChipField to be clickable
                            onClick: $2eed9b3621f13b18$var$handleClick
                        })
                    }, record.id);
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                appendLink && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, ($parcel$interopDefault($5MILa$muiiconsmaterialAddCircle))), {
                    color: "primary",
                    className: classes.addIcon,
                    onClick: appendLink
                })
            ]
        })
    );
};
var $2eed9b3621f13b18$export$2e2bcd8739ae039 = $2eed9b3621f13b18$var$ChipList;







// useful to prevent click bubbling in a datagrid with rowClick
const $a4d27c2ab268c05b$var$stopPropagation = (e: any) => e.stopPropagation();
// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const $a4d27c2ab268c05b$var$handleClick = ()=>{};
// @ts-expect-error TS(7031): Binding element 'children' implicitly has an 'any'... Remove this comment to see the full error message
const $a4d27c2ab268c05b$var$GridList = ({ children: children, linkType: linkType = 'edit', externalLinks: externalLinks = false, spacing: spacing = 3, xs: xs = 6, sm: sm, md: md, lg: lg, xl: xl })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { data: data, resource: resource, isLoading: isLoading } = (0, $5MILa$reactadmin.useListContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const getExternalLink = (0, $5MILa$semappssemanticdataprovider.useGetExternalLink)(externalLinks);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const createPath = (0, $5MILa$reactadmin.useCreatePath)();
    if (isLoading || !data) return null;
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.Grid), {
            container: true,
            spacing: spacing,
            children: data.map((record: any) => {
                if (!record || record._error) return null;
                const externalLink = getExternalLink(record);
                let child;
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.Grid), {
                    item: true,
                    xs: xs,
                    sm: sm,
                    md: md,
                    lg: lg,
                    xl: xl,
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.RecordContextProvider), {
                        value: record,
                        children: child
                    })
                }, record.id);
            })
        })
    );
};
var $a4d27c2ab268c05b$export$2e2bcd8739ae039 = $a4d27c2ab268c05b$var$GridList;








// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
 // @ts-expect-error TS(7031): Binding element 'image' implicitly has an 'any' ty... Remove this comment to see the full error message
 */ const $bc22719d52a02d2c$var$MasonryList = ({ image: image, content: content, actions: actions, breakpointCols: breakpointCols = {
    default: 3,
    1050: 2,
    700: 1
}, linkType: linkType = 'edit' })=>{
    const classes = $bc22719d52a02d2c$var$useStyles();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { data: data, resource: resource } = (0, $5MILa$reactadmin.useListContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const createPath = (0, $5MILa$reactadmin.useCreatePath)();
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, ($parcel$interopDefault($5MILa$reactmasonrycss))), {
            breakpointCols: breakpointCols,
            className: classes.grid,
            columnClassName: classes.column,
            children: data.map((record: any) => {
                if (!record || record._error) return null;
                const imageUrl = typeof image === 'function' ? image(record) : image;
                return (
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.RecordContextProvider), {
                        value: record,
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)((0, $5MILa$muimaterial.Card), {
                            className: classes.card,
                            children: [
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.Link), {
                                    to: createPath({
                                        resource: resource,
                                        id: record.id,
                                        type: linkType
                                    }),
                                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                    children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)((0, $5MILa$muimaterial.CardActionArea), {
                                        children: [
                                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                            imageUrl && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.CardMedia), {
                                                className: classes.media,
                                                image: imageUrl
                                            }),
                                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                            content && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.CardContent), {
                                                children: content(record)
                                            })
                                        ]
                                    })
                                }),
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                actions && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$muimaterial.CardActions), {
                                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                    children: actions.map((action: any) => /*#__PURE__*/ (0, ($parcel$interopDefault($5MILa$react))).createElement(action))
                                })
                            ]
                        }, record.id)
                    })
                );
            })
        })
    );
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
const $696f298352ead676$var$toArray = (e: any) => [].concat(e);
// @ts-expect-error TS(7031): Binding element 'source' implicitly has an 'any' t... Remove this comment to see the full error message
const $696f298352ead676$var$ReferenceFilterCounter = ({ source: source, id: id })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const resourceContext = (0, $5MILa$reactadmin.useResourceContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { data: data } = (0, $5MILa$reactadmin.useGetList)(resourceContext, {
        pagination: {
            page: 1,
            perPage: Infinity
        }
    });
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)((0, $5MILa$reactjsxruntime.Fragment), {
            children: [
                "\xa0",
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                data && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)("span", {
                    className: "filter-count",
                    // @ts-expect-error TS(2345): Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
                    children: `(${data.filter((d: any) => $696f298352ead676$var$toArray(d[source]).includes(id)).length})`
                })
            ]
        })
    );
};
// @ts-expect-error TS(7031): Binding element 'reference' implicitly has an 'any... Remove this comment to see the full error message
const $696f298352ead676$var$ReferenceFilter = ({ reference: reference, source: source, inverseSource: inverseSource, limit: limit = 25, sort: sort, filter: filter, label: label, icon: icon, showCounters: showCounters = true })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { data: data, isLoading: isLoading } = (0, $5MILa$reactadmin.useGetList)(reference, {
        pagination: {
            page: 1,
            perPage: limit
        },
        sort: sort,
        filter: filter
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const currentResource = (0, $5MILa$reactadmin.useResourceDefinition)({
        resource: reference
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const resourceContext = (0, $5MILa$reactadmin.useResourceContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const resourceContextContainers = (0, $5MILa$semappssemanticdataprovider.useContainers)(resourceContext);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { setFilters: setFilters } = (0, $5MILa$reactadmin.useListContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $5MILa$react.useEffect)(()=>{
        // Needed when filter item is active and its last relation is removed
        const urlSearchParams = new URLSearchParams(window.location.search);
        if (!urlSearchParams.get('filter') && !isLoading) setFilters({}, []);
    }, [
        isLoading,
        setFilters
    ]);
    const itemIsUsed = (itemData: any) => {
        if (!inverseSource) return true;
        if (!resourceContextContainers || !itemData) return false;
        return Object.values(resourceContextContainers).flat().some((containerUrl)=>{
            if (!itemData[inverseSource]) return false;
            return $696f298352ead676$var$toArray(itemData[inverseSource]).some((inverseSourceData)=>{
                // @ts-expect-error TS(2339): Property 'startsWith' does not exist on type 'neve... Remove this comment to see the full error message
                return inverseSourceData?.startsWith(containerUrl);
            });
        });
    };
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.FilterList), {
            label: label || currentResource?.options?.label || '',
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            icon: icon || currentResource?.icon ? /*#__PURE__*/ (0, $5MILa$react.createElement)(currentResource.icon) : undefined,
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            children: data && data.filter((itemData: any) => itemIsUsed(itemData)).map((itemData: any) => /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.FilterListItem), {
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    label: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)("span", {
                        className: "filter-label",
                        children: [
                            itemData['pair:label'],
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
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
        })
    );
};
var $696f298352ead676$export$2e2bcd8739ae039 = $696f298352ead676$var$ReferenceFilter;















// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $1f2a4ca7a7e2b912$var$ListViewContext = /*#__PURE__*/ (0, ($parcel$interopDefault($5MILa$react))).createContext({
    views: null,
    currentView: null,
    setView: ()=>null
});
var $1f2a4ca7a7e2b912$export$2e2bcd8739ae039 = $1f2a4ca7a7e2b912$var$ListViewContext;


const $2b75f3c2996d19f7$var$ViewsButtons = ()=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const query = new URLSearchParams((0, $5MILa$reactrouter.useLocation)().search);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { views: views, currentView: currentView, setView: setView } = (0, ($parcel$interopDefault($5MILa$react))).useContext((0, $1f2a4ca7a7e2b912$export$2e2bcd8739ae039));
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
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.Link), {
            to: `?${query.toString()}`,
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.Button), {
                onClick: ()=>setView(key),
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
                label: view.label,
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                children: /*#__PURE__*/ (0, ($parcel$interopDefault($5MILa$react))).createElement(view.icon)
            })
        }, key);
    }) : null;
};
var $2b75f3c2996d19f7$export$2e2bcd8739ae039 = $2b75f3c2996d19f7$var$ViewsButtons;


// @ts-expect-error TS(7031): Binding element 'bulkActions' implicitly has an 'a... Remove this comment to see the full error message
const $6ca83fab5dd482a0$var$ListActionsWithViews = ({ bulkActions: bulkActions, basePath: basePath, sort: sort, displayedFilters: displayedFilters, exporter: exporter, filters: filters, filterValues: filterValues, onUnselectItems: onUnselectItems, selectedIds: selectedIds, showFilter: showFilter, total: total, ...rest })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const xs = (0, $5MILa$muimaterial.useMediaQuery)((theme: any) => theme.breakpoints.down('sm'));
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const resourceDefinition = (0, $5MILa$reactadmin.useResourceDefinition)(rest);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsxs)((0, $5MILa$reactadmin.TopToolbar), {
        children: [
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $2b75f3c2996d19f7$export$2e2bcd8739ae039), {}),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            filters && /*#__PURE__*/ (0, ($parcel$interopDefault($5MILa$react))).cloneElement(filters, {
                showFilter: showFilter,
                displayedFilters: displayedFilters,
                filterValues: filterValues,
                context: 'button'
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            resourceDefinition.hasCreate && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.CreateButton), {}),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            !xs && exporter !== false && /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $5MILa$reactadmin.ExportButton), {
                disabled: total === 0,
                sort: sort,
                filter: filterValues,
                exporter: exporter
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            bulkActions && /*#__PURE__*/ (0, ($parcel$interopDefault($5MILa$react))).cloneElement(bulkActions, {
                filterValues: filterValues,
                selectedIds: selectedIds,
                onUnselectItems: onUnselectItems
            })
        ]
    });
};
var $6ca83fab5dd482a0$export$2e2bcd8739ae039 = $6ca83fab5dd482a0$var$ListActionsWithViews;



// @ts-expect-error TS(7031): Binding element 'children' implicitly has an 'any'... Remove this comment to see the full error message
const $8e315201c1049d3f$var$MultiViewsList = ({ children: children, actions: actions = /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $6ca83fab5dd482a0$export$2e2bcd8739ae039), {}), views: views, ListComponent: ListComponent = (0, $5MILa$reactadmin.List), ...otherProps })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const query = new URLSearchParams((0, $5MILa$reactrouter.useLocation)().search);
    const initialView = query.has('view') ? query.get('view') : Object.keys(views)[0];
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [currentView, setView] = (0, $5MILa$react.useState)(initialView);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)((0, $1f2a4ca7a7e2b912$export$2e2bcd8739ae039).Provider, {
        value: {
            views: views,
            currentView: currentView,
            setView: setView
        },
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children: /*#__PURE__*/ (0, $5MILa$reactjsxruntime.jsx)(ListComponent, {
            actions: actions,
            pagination: views[currentView].pagination,
            // Set initial values, but use the query string to change these values to avoid a complete refresh
            // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
            perPage: views[initialView].perPage,
            // @ts-expect-error TS(2538): Type 'null' cannot be used as an index type.
            sort: views[initialView].sort,
            ...otherProps,
            children: views[currentView].list
        })
    });
};
var $8e315201c1049d3f$export$2e2bcd8739ae039 = $8e315201c1049d3f$var$MultiViewsList;







//# sourceMappingURL=index.cjs.js.map
