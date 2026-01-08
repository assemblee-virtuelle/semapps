var $CiwlJ$reactjsxruntime = require("react/jsx-runtime");
var $CiwlJ$react = require("react");
var $CiwlJ$reactadmin = require("react-admin");
var $CiwlJ$muimaterial = require("@mui/material");
var $CiwlJ$muimaterialAutocomplete = require("@mui/material/Autocomplete");
var $CiwlJ$muiiconsmaterialLocationOn = require("@mui/icons-material/LocationOn");
var $CiwlJ$autosuggesthighlightmatch = require("autosuggest-highlight/match");
var $CiwlJ$autosuggesthighlightparse = require("autosuggest-highlight/parse");
var $CiwlJ$lodashthrottle = require("lodash.throttle");
var $CiwlJ$muisystem = require("@mui/system");
var $CiwlJ$reactrouterdom = require("react-router-dom");
var $CiwlJ$muistylesmakeStyles = require("@mui/styles/makeStyles");
var $CiwlJ$muimaterialCircularProgress = require("@mui/material/CircularProgress");
require("leaflet-defaulticon-compatibility");
var $CiwlJ$reactleaflet = require("react-leaflet");
var $CiwlJ$leaflet = require("leaflet");
var $CiwlJ$reactleafletcore = require("@react-leaflet/core");
require("leaflet.markercluster");
var $CiwlJ$muiiconsmaterialClear = require("@mui/icons-material/Clear");


function $parcel$export(e: any, n: any, v: any, s: any) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a: any) {
  return a && a.__esModule ? a.default : a;
}

// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "extractContext", () => $afab6c0f6ffa522c$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "LocationInput", () => $7a57fad6c56283a6$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "MapList", () => $3929b9df2dd76406$export$2e2bcd8739ae039);
// @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
$parcel$export(module.exports, "MapField", () => $7855b7e2551c6d96$export$2e2bcd8739ae039);
const $afab6c0f6ffa522c$var$extractContext = (context: any, key: any)=>{
    const property = context.find((property: any) => property.id.startsWith(`${key}.`));
    if (property) return property.text;
};
var $afab6c0f6ffa522c$export$2e2bcd8739ae039 = $afab6c0f6ffa522c$var$extractContext;












// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $7a57fad6c56283a6$var$StyledLocationOnIcon = (0, $CiwlJ$muisystem.styled)((0, ($parcel$interopDefault($CiwlJ$muiiconsmaterialLocationOn))))(({ theme: theme })=>({
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2)
    }));
const $7a57fad6c56283a6$var$selectOptionText = (option: any, optionText: any)=>{
    if (option.place_name) return option.place_name;
    if (typeof optionText === 'string') return option[optionText];
    if (typeof optionText === 'function') return optionText(option);
};
// @ts-expect-error TS(7031): Binding element 'mapboxConfig' implicitly has an '... Remove this comment to see the full error message
const $7a57fad6c56283a6$var$LocationInput = ({ mapboxConfig: mapboxConfig, source: source, label: label, parse: parse, optionText: optionText, helperText: helperText, variant: variant = 'outlined', size: size = 'small', ...rest })=>{
    if (!mapboxConfig) throw new Error('@semapps/geo-components : No mapbox configuration');
    if (!mapboxConfig.access_token) throw new Error('@semapps/geo-components : No access token in mapbox configuration');
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $CiwlJ$reactadmin.useRecordContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const resource = (0, $CiwlJ$reactadmin.useResourceContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const locale = (0, $CiwlJ$reactadmin.useLocale)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const translate = (0, $CiwlJ$reactadmin.useTranslate)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [keyword, setKeyword] = (0, $CiwlJ$react.useState)(''); // Typed keywords
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [options, setOptions] = (0, $CiwlJ$react.useState)([]); // Options returned by MapBox
    // Do not pass the `parse` prop to useInput, as we manually call it on the onChange prop below
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { field: { value: value, onChange: onChange, onBlur: onBlur /* , onFocus */  }, isRequired: isRequired, fieldState: { error: error, isTouched: /* submitError, */ isTouched } } = (0, $CiwlJ$reactadmin.useInput)({
        resource: resource,
        source: source,
        ...rest
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const fetchMapbox = (0, $CiwlJ$react.useMemo)(()=>(0, ($parcel$interopDefault($CiwlJ$lodashthrottle)))((keyword: any, callback: any)=>{
            const fetchUrl = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${keyword}.json`);
            // Use locale as default language
            if (!mapboxConfig.language) mapboxConfig.language = locale;
            // All options available at https://docs.mapbox.com/api/search/geocoding/#forward-geocoding
            Object.entries(mapboxConfig).forEach(([key, value])=>{
                if (Array.isArray(value)) value = value.join(',');
                else if (typeof value === 'boolean') value = value ? 'true' : 'false';
                // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
                fetchUrl.searchParams.set(key, value);
            });
            fetch(fetchUrl.toString()).then((res)=>res.json()).then((json)=>callback(json));
        }, 200), [
        mapboxConfig,
        locale
    ]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $CiwlJ$react.useEffect)(()=>{
        // Do not trigger search if text input is empty or if it is the same as the current value
        if (!keyword || keyword === $7a57fad6c56283a6$var$selectOptionText(value, optionText)) return undefined;
        fetchMapbox(keyword, (results: any) => setOptions(results.features));
    }, [
        value,
        keyword,
        fetchMapbox
    ]);
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, ($parcel$interopDefault($CiwlJ$muimaterialAutocomplete))), {
            autoComplete: true,
            value: value || null,
            // We must include the current value as an option, to avoid this error
            // https://github.com/mui-org/material-ui/issues/18514#issuecomment-636096386
            options: value ? [
                value,
                ...options
            ] : options,
            // Do not show the current value as an option (this would break renderOptions)
            filterSelectedOptions: true,
            // For some reasons, this prop has to be passed
            filterOptions: (x: any) => x,
            getOptionLabel: (option: any) => $7a57fad6c56283a6$var$selectOptionText(option, optionText),
            isOptionEqualToValue: (option: any, value: any)=>$7a57fad6c56283a6$var$selectOptionText(option, optionText) === $7a57fad6c56283a6$var$selectOptionText(value, optionText),
            // This function is called when the user selects an option
            onChange: (event: any, newValue: any)=>{
                // Parse only if the value is not null (happens if the user clears the value)
                if (newValue && parse) newValue = parse(newValue);
                onChange(newValue);
                setOptions([]);
            },
            onInputChange: (event: any, newKeyword: any)=>setKeyword(newKeyword),
            noOptionsText: translate('ra.navigation.no_results'),
            renderInput: (params: any) => {
                // Autocomplete=off doesn't work anymore in modern browsers
                // https://stackoverflow.com/a/40791726/7900695
                params.inputProps.autoComplete = 'new-password';
                return (
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.TextField), {
                        ...params,
                        inputProps: {
                            ...params.inputProps,
                            onBlur: (e: any) => {
                                onBlur(e);
                                if (params.inputProps.onBlur) params.inputProps.onBlur(e);
                            } /* ,
                      onFocus: e => {
                        onFocus(e);
                        if (params.inputProps.onFocus) {
                          params.inputProps.onFocus(e);
                        }
                      } */ 
                        },
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        label: label !== '' && label !== false && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactadmin.FieldTitle), {
                            label: label,
                            source: source,
                            resource: resource,
                            isRequired: isRequired
                        }),
                        error: !!(isTouched && error),
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        helperText: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactadmin.InputHelperText), {
                            touched: isTouched,
                            error: error /* || submitError */ ,
                            helperText: helperText
                        }),
                        ...rest
                    })
                );
            },
            renderOption: (props: any, option: any, state: any)=>{
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                const matches = (0, ($parcel$interopDefault($CiwlJ$autosuggesthighlightmatch)))(option.text, keyword);
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                const parts = (0, ($parcel$interopDefault($CiwlJ$autosuggesthighlightparse)))(option.text, matches);
                return (
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)("li", {
                        ...props,
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, $CiwlJ$muimaterial.Grid), {
                            container: true,
                            alignItems: "center",
                            children: [
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Grid), {
                                    item: true,
                                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                    children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)($7a57fad6c56283a6$var$StyledLocationOnIcon, {})
                                }),
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, $CiwlJ$muimaterial.Grid), {
                                    item: true,
                                    xs: true,
                                    children: [
                                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                        typeof parts === 'string' ? parts : parts.map((part: any, index: any)=>/*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)("span", {
                                                style: {
                                                    fontWeight: part.highlight ? 700 : 400
                                                },
                                                children: part.text
                                            }, index)),
                                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                        /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Typography), {
                                            variant: "body2",
                                            color: "textSecondary",
                                            children: option.place_name
                                        })
                                    ]
                                })
                            ]
                        })
                    })
                );
            },
            variant: variant,
            size: size,
            ...rest
        })
    );
};
var $7a57fad6c56283a6$export$2e2bcd8739ae039 = $7a57fad6c56283a6$var$LocationInput;














// Taken from https://github.com/changey/react-leaflet-markercluster/blob/60992857087c181ada1e8e6659a6666a13c1f868/src/react-leaflet-markercluster.js
// @ts-expect-error TS(7031): Binding element '_c' implicitly has an 'any' type.
function $7390fd757b2ce4b0$var$createMarkerCluster({ children: _c, ...props }, context: any) {
    const clusterProps = {};
    const clusterEvents = {};
    // Splitting props and events to different objects
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    Object.entries(props).forEach(([propName, prop])=>propName.startsWith('on') ? clusterEvents[propName] = prop : clusterProps[propName] = prop);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const instance = new ((0, ($parcel$interopDefault($CiwlJ$leaflet))).MarkerClusterGroup)(clusterProps);
    // Initializing event listeners
    Object.entries(clusterEvents).forEach(([eventAsProp, callback])=>{
        const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`;
        instance.on(clusterEvent, callback);
    });
    return {
        instance: instance,
        context: {
            ...context,
            layerContainer: instance
        }
    };
}
// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $7390fd757b2ce4b0$var$MarkerClusterGroup = (0, $CiwlJ$reactleafletcore.createPathComponent)($7390fd757b2ce4b0$var$createMarkerCluster);
var $7390fd757b2ce4b0$export$2e2bcd8739ae039 = $7390fd757b2ce4b0$var$MarkerClusterGroup;






const $e9a08b6b577904d6$var$DefaultPopupContent = ()=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $CiwlJ$reactadmin.useRecordContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const resourceDefinition = (0, $CiwlJ$reactadmin.useResourceDefinition)({});
    if (!record) return null;
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, $CiwlJ$reactjsxruntime.Fragment), {
        children: [
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            record.label && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Typography), {
                variant: "h5",
                children: record.label
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            record.description && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Typography), {
                children: record.description.length > 150 ? `${record.description.substring(0, 150)}...` : record.description
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            resourceDefinition.hasShow && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactadmin.ShowButton), {}),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            resourceDefinition.hasEdit && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactadmin.EditButton), {})
        ]
    });
};
var $e9a08b6b577904d6$export$2e2bcd8739ae039 = $e9a08b6b577904d6$var$DefaultPopupContent;




// Keep the zoom and center in query string, so that when we navigate back to the page, it stays focused on the same area
const $4340bf725cfbb626$var$QueryStringUpdater = ()=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [searchParams, setSearchParams] = (0, $CiwlJ$reactrouterdom.useSearchParams)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $CiwlJ$reactleaflet.useMapEvents)({
        moveend: (test: any) => {
            setSearchParams((params: any) => ({
                ...Object.fromEntries(params),
                lat: test.target.getCenter().lat,
                lng: test.target.getCenter().lng,
                zoom: test.target.getZoom()
            }));
        },
        zoomend: (test: any) => {
            setSearchParams((params: any) => ({
                ...Object.fromEntries(params),
                zoom: test.target.getZoom()
            }));
        }
    });
    return null;
};
var $4340bf725cfbb626$export$2e2bcd8739ae039 = $4340bf725cfbb626$var$QueryStringUpdater;









// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $31c59492060af504$var$useStyles = (0, ($parcel$interopDefault($CiwlJ$muistylesmakeStyles)))(()=>({
        closeButton: {
            position: 'absolute',
            zIndex: 1400,
            top: 0,
            right: 0
        }
    }));
// @ts-expect-error TS(7031): Binding element 'popupContent' implicitly has an '... Remove this comment to see the full error message
const $31c59492060af504$var$MobileDrawer = ({ popupContent: popupContent, onClose: onClose })=>{
    const classes = $31c59492060af504$var$useStyles();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $CiwlJ$reactadmin.useRecordContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const map = (0, $CiwlJ$reactleaflet.useMap)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $CiwlJ$react.useEffect)(()=>{
        if (record) map.setView([
            record.latitude,
            record.longitude
        ]);
    }, [
        record,
        map
    ]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Drawer), {
        anchor: "bottom",
        open: !!record,
        onClose: onClose,
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, $CiwlJ$muimaterial.Box), {
            p: 1,
            position: "relative",
            children: [
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.IconButton), {
                    onClick: onClose,
                    className: classes.closeButton,
                    size: "large",
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, ($parcel$interopDefault($CiwlJ$muiiconsmaterialClear))), {})
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, ($parcel$interopDefault($CiwlJ$react))).createElement(popupContent)
            ]
        })
    });
};
var $31c59492060af504$export$2e2bcd8739ae039 = $31c59492060af504$var$MobileDrawer;


// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $3929b9df2dd76406$var$useStyles = (0, ($parcel$interopDefault($CiwlJ$muistylesmakeStyles)))(()=>({
        isLoading: {
            zIndex: 1000,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    }));
// @ts-expect-error TS(7031): Binding element 'latitude' implicitly has an 'any'... Remove this comment to see the full error message
const $3929b9df2dd76406$var$MapList = ({ latitude: latitude, longitude: longitude, label: label, description: description, popupContent: popupContent = (0, $e9a08b6b577904d6$export$2e2bcd8739ae039), height: height = 700, center: center = [
    47,
    2.213749
// @ts-expect-error TS(7031): Binding element 'boundToMarkers' implicitly has an... Remove this comment to see the full error message
], zoom: zoom = 6, groupClusters: groupClusters = true, boundToMarkers: boundToMarkers, connectMarkers: connectMarkers = false, scrollWheelZoom: scrollWheelZoom = false, ...otherProps })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { data: data, isLoading: isLoading } = (0, $CiwlJ$reactadmin.useListContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const xs = (0, $CiwlJ$muimaterial.useMediaQuery)((theme: any) => theme.breakpoints.down('sm'), {
        noSsr: true
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [drawerRecord, setDrawerRecord] = (0, $CiwlJ$react.useState)(null);
    const classes = $3929b9df2dd76406$var$useStyles();
    // Get the zoom and center from query string, if available
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const location = (0, $CiwlJ$reactrouterdom.useLocation)();
    const query = new URLSearchParams(location.search);
    // @ts-expect-error TS(2322): Type 'number[] | (string | null)[]' is not assigna... Remove this comment to see the full error message
    center = query.has('lat') && query.has('lng') ? [
        query.get('lat'),
        query.get('lng')
    ] : center;
    // @ts-expect-error TS(2322): Type 'string | number | null' is not assignable to... Remove this comment to see the full error message
    zoom = query.has('zoom') ? query.get('zoom') : zoom;
    let previousRecord: any;
    const records = isLoading ? [] : data.map((record: any) => ({
        ...record,
        latitude: latitude && latitude(record),
        longitude: longitude && longitude(record),
        label: label && label(record),
        description: description && description(record)
    })).filter((record: any) => record.latitude && record.longitude);
    const bounds = boundToMarkers && records.length > 0 ? records.map((record: any) => [
            record.latitude,
            record.longitude
        ]) : undefined;
    // Do not display anything if the bounds are not ready, otherwise the MapContainer will not be initialized correctly
    if (boundToMarkers && !bounds) return null;
    const markers = records.map((record: any, i: any)=>{
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        const marker = /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, ($parcel$interopDefault($CiwlJ$react))).Fragment, {
            children: [
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactleaflet.Marker), {
                    position: [
                        record.latitude,
                        record.longitude
                    ],
                    eventHandlers: xs ? {
                        click: ()=>setDrawerRecord(record)
                    } : undefined,
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    children: !xs && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactleaflet.Popup), {
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactadmin.RecordContextProvider), {
                            value: record,
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            children: /*#__PURE__*/ (0, ($parcel$interopDefault($CiwlJ$react))).createElement(popupContent)
                        })
                    })
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                connectMarkers && previousRecord && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactleaflet.Polyline), {
                    positions: [
                        [
                            previousRecord.latitude,
                            previousRecord.longitude
                        ],
                        [
                            record.latitude,
                            record.longitude
                        ]
                    ]
                })
            ]
        }, i);
        // Save record so that we can trace lines
        previousRecord = record;
        return marker;
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, $CiwlJ$reactleaflet.MapContainer), {
        style: {
            height: height
        },
        center: !boundToMarkers ? center : undefined,
        zoom: !boundToMarkers ? zoom : undefined,
        bounds: bounds,
        scrollWheelZoom: scrollWheelZoom,
        ...otherProps,
        children: [
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactleaflet.TileLayer), {
                attribution: '\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            isLoading && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Box), {
                alignItems: "center",
                className: classes.isLoading,
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, ($parcel$interopDefault($CiwlJ$muimaterialCircularProgress))), {
                    size: 60,
                    thickness: 6
                })
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            groupClusters ? /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $7390fd757b2ce4b0$export$2e2bcd8739ae039), {
                showCoverageOnHover: false,
                children: markers
            }) : markers,
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $4340bf725cfbb626$export$2e2bcd8739ae039), {}),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactadmin.RecordContextProvider), {
                value: drawerRecord,
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $31c59492060af504$export$2e2bcd8739ae039), {
                    popupContent: popupContent,
                    onClose: ()=>setDrawerRecord(null)
                })
            })
        ]
    });
};
var $3929b9df2dd76406$export$2e2bcd8739ae039 = $3929b9df2dd76406$var$MapList;









// @ts-expect-error TS(7031): Binding element 'center' implicitly has an 'any' t... Remove this comment to see the full error message
const $a907502a25565c32$var$ChangeView = ({ center: center, zoom: zoom })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const map = (0, $CiwlJ$reactleaflet.useMap)();
    map.setView(center, zoom);
    return null;
};
var $a907502a25565c32$export$2e2bcd8739ae039 = $a907502a25565c32$var$ChangeView;


// @ts-expect-error TS(7031): Binding element 'latitude' implicitly has an 'any'... Remove this comment to see the full error message
const $7855b7e2551c6d96$var$MapField = ({ latitude: latitude, longitude: longitude, address: address, height: height = 400, zoom: zoom = 11, typographyProps: typographyProps, ...rest })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $CiwlJ$reactadmin.useRecordContext)();
    const position = [
        latitude(record),
        longitude(record)
    ];
    // Do not display the component if it has no latitude or longitude
    if (!position[0] || !position[1]) return null;
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, $CiwlJ$muimaterial.Box), {
        children: [
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            address && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Box), {
                mt: 1,
                mb: 1,
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Typography), {
                    ...typographyProps,
                    children: address(record)
                })
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, $CiwlJ$reactleaflet.MapContainer), {
                style: {
                    height: height
                },
                center: position,
                zoom: zoom,
                ...rest,
                children: [
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $a907502a25565c32$export$2e2bcd8739ae039), {
                        center: position
                    }),
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactleaflet.TileLayer), {
                        attribution: '\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }),
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactleaflet.Marker), {
                        position: position
                    })
                ]
            })
        ]
    });
};
var $7855b7e2551c6d96$export$2e2bcd8739ae039 = $7855b7e2551c6d96$var$MapField;




//# sourceMappingURL=index.cjs.js.map
