import {jsx as $4dBGn$jsx, jsxs as $4dBGn$jsxs, Fragment as $4dBGn$Fragment} from "react/jsx-runtime";
import $4dBGn$react, {useState as $4dBGn$useState, useMemo as $4dBGn$useMemo, useEffect as $4dBGn$useEffect} from "react";
import {useRecordContext as $4dBGn$useRecordContext, useResourceContext as $4dBGn$useResourceContext, useLocale as $4dBGn$useLocale, useTranslate as $4dBGn$useTranslate, useInput as $4dBGn$useInput, FieldTitle as $4dBGn$FieldTitle, InputHelperText as $4dBGn$InputHelperText, useListContext as $4dBGn$useListContext, RecordContextProvider as $4dBGn$RecordContextProvider, useResourceDefinition as $4dBGn$useResourceDefinition, ShowButton as $4dBGn$ShowButton, EditButton as $4dBGn$EditButton} from "react-admin";
import {TextField as $4dBGn$TextField, Grid as $4dBGn$Grid, Typography as $4dBGn$Typography, useMediaQuery as $4dBGn$useMediaQuery, Box as $4dBGn$Box, Drawer as $4dBGn$Drawer, IconButton as $4dBGn$IconButton} from "@mui/material";
import $4dBGn$muimaterialAutocomplete from "@mui/material/Autocomplete";
import $4dBGn$muiiconsmaterialLocationOn from "@mui/icons-material/LocationOn";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'auto... Remove this comment to see the full error message
import $4dBGn$autosuggesthighlightmatch from "autosuggest-highlight/match";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'auto... Remove this comment to see the full error message
import $4dBGn$autosuggesthighlightparse from "autosuggest-highlight/parse";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import $4dBGn$lodashthrottle from "lodash.throttle";
import {styled as $4dBGn$styled} from "@mui/system";
import {useLocation as $4dBGn$useLocation, useSearchParams as $4dBGn$useSearchParams} from "react-router-dom";
// @ts-expect-error TS(2307): Cannot find module '@mui/styles/makeStyles' or its... Remove this comment to see the full error message
import $4dBGn$muistylesmakeStyles from "@mui/styles/makeStyles";
import $4dBGn$muimaterialCircularProgress from "@mui/material/CircularProgress";
import "leaflet-defaulticon-compatibility";
import {Marker as $4dBGn$Marker, Popup as $4dBGn$Popup, Polyline as $4dBGn$Polyline, MapContainer as $4dBGn$MapContainer, TileLayer as $4dBGn$TileLayer, useMapEvents as $4dBGn$useMapEvents, useMap as $4dBGn$useMap} from "react-leaflet";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'leaf... Remove this comment to see the full error message
import $4dBGn$leaflet from "leaflet";
import {createPathComponent as $4dBGn$createPathComponent} from "@react-leaflet/core";
import "leaflet.markercluster";
import $4dBGn$muiiconsmaterialClear from "@mui/icons-material/Clear";

const $85f5b044a3dfefc9$var$extractContext = (context: any, key: any)=>{
    const property = context.find((property: any) => property.id.startsWith(`${key}.`));
    if (property) return property.text;
};
var $85f5b044a3dfefc9$export$2e2bcd8739ae039 = $85f5b044a3dfefc9$var$extractContext;












// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $30efcd78e923a66d$var$StyledLocationOnIcon = (0, $4dBGn$styled)((0, $4dBGn$muiiconsmaterialLocationOn))(({ theme: theme })=>({
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2)
    }));
const $30efcd78e923a66d$var$selectOptionText = (option: any, optionText: any)=>{
    if (option.place_name) return option.place_name;
    if (typeof optionText === 'string') return option[optionText];
    if (typeof optionText === 'function') return optionText(option);
};
// @ts-expect-error TS(7031): Binding element 'mapboxConfig' implicitly has an '... Remove this comment to see the full error message
const $30efcd78e923a66d$var$LocationInput = ({ mapboxConfig: mapboxConfig, source: source, label: label, parse: parse, optionText: optionText, helperText: helperText, variant: variant = 'outlined', size: size = 'small', ...rest })=>{
    if (!mapboxConfig) throw new Error('@semapps/geo-components : No mapbox configuration');
    if (!mapboxConfig.access_token) throw new Error('@semapps/geo-components : No access token in mapbox configuration');
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $4dBGn$useRecordContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const resource = (0, $4dBGn$useResourceContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const locale = (0, $4dBGn$useLocale)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const translate = (0, $4dBGn$useTranslate)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [keyword, setKeyword] = (0, $4dBGn$useState)(''); // Typed keywords
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [options, setOptions] = (0, $4dBGn$useState)([]); // Options returned by MapBox
    // Do not pass the `parse` prop to useInput, as we manually call it on the onChange prop below
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { field: { value: value, onChange: onChange, onBlur: onBlur /* , onFocus */  }, isRequired: isRequired, fieldState: { error: error, isTouched: /* submitError, */ isTouched } } = (0, $4dBGn$useInput)({
        resource: resource,
        source: source,
        ...rest
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const fetchMapbox = (0, $4dBGn$useMemo)(()=>(0, $4dBGn$lodashthrottle)((keyword: any, callback: any)=>{
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
    (0, $4dBGn$useEffect)(()=>{
        // Do not trigger search if text input is empty or if it is the same as the current value
        if (!keyword || keyword === $30efcd78e923a66d$var$selectOptionText(value, optionText)) return undefined;
        fetchMapbox(keyword, (results: any) => setOptions(results.features));
    }, [
        value,
        keyword,
        fetchMapbox
    ]);
    return (
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$muimaterialAutocomplete), {
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
            getOptionLabel: (option: any) => $30efcd78e923a66d$var$selectOptionText(option, optionText),
            isOptionEqualToValue: (option: any, value: any)=>$30efcd78e923a66d$var$selectOptionText(option, optionText) === $30efcd78e923a66d$var$selectOptionText(value, optionText),
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
                    /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$TextField), {
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
                        label: label !== '' && label !== false && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$FieldTitle), {
                            label: label,
                            source: source,
                            resource: resource,
                            isRequired: isRequired
                        }),
                        error: !!(isTouched && error),
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        helperText: /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$InputHelperText), {
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
                const matches = (0, $4dBGn$autosuggesthighlightmatch)(option.text, keyword);
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                const parts = (0, $4dBGn$autosuggesthighlightparse)(option.text, matches);
                return (
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $4dBGn$jsx)("li", {
                        ...props,
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        children: /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$Grid), {
                            container: true,
                            alignItems: "center",
                            children: [
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Grid), {
                                    item: true,
                                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                    children: /*#__PURE__*/ (0, $4dBGn$jsx)($30efcd78e923a66d$var$StyledLocationOnIcon, {})
                                }),
                                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$Grid), {
                                    item: true,
                                    xs: true,
                                    children: [
                                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                        typeof parts === 'string' ? parts : parts.map((part: any, index: any)=>/*#__PURE__*/ (0, $4dBGn$jsx)("span", {
                                                style: {
                                                    fontWeight: part.highlight ? 700 : 400
                                                },
                                                children: part.text
                                            }, index)),
                                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                                        /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Typography), {
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
var $30efcd78e923a66d$export$2e2bcd8739ae039 = $30efcd78e923a66d$var$LocationInput;














// Taken from https://github.com/changey/react-leaflet-markercluster/blob/60992857087c181ada1e8e6659a6666a13c1f868/src/react-leaflet-markercluster.js
// @ts-expect-error TS(7031): Binding element '_c' implicitly has an 'any' type.
function $30b7ce6cee91ee5d$var$createMarkerCluster({ children: _c, ...props }, context: any) {
    const clusterProps = {};
    const clusterEvents = {};
    // Splitting props and events to different objects
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    Object.entries(props).forEach(([propName, prop])=>propName.startsWith('on') ? clusterEvents[propName] = prop : clusterProps[propName] = prop);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const instance = new (0, $4dBGn$leaflet).MarkerClusterGroup(clusterProps);
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
const $30b7ce6cee91ee5d$var$MarkerClusterGroup = (0, $4dBGn$createPathComponent)($30b7ce6cee91ee5d$var$createMarkerCluster);
var $30b7ce6cee91ee5d$export$2e2bcd8739ae039 = $30b7ce6cee91ee5d$var$MarkerClusterGroup;






const $0af94055ba27b10f$var$DefaultPopupContent = ()=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $4dBGn$useRecordContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const resourceDefinition = (0, $4dBGn$useResourceDefinition)({});
    if (!record) return null;
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$Fragment), {
        children: [
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            record.label && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Typography), {
                variant: "h5",
                children: record.label
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            record.description && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Typography), {
                children: record.description.length > 150 ? `${record.description.substring(0, 150)}...` : record.description
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            resourceDefinition.hasShow && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$ShowButton), {}),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            resourceDefinition.hasEdit && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$EditButton), {})
        ]
    });
};
var $0af94055ba27b10f$export$2e2bcd8739ae039 = $0af94055ba27b10f$var$DefaultPopupContent;




// Keep the zoom and center in query string, so that when we navigate back to the page, it stays focused on the same area
const $41a820134d906e83$var$QueryStringUpdater = ()=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [searchParams, setSearchParams] = (0, $4dBGn$useSearchParams)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $4dBGn$useMapEvents)({
        moveend: (test: any) => {
            setSearchParams((params)=>({
                    ...Object.fromEntries(params),
                    lat: test.target.getCenter().lat,
                    lng: test.target.getCenter().lng,
                    zoom: test.target.getZoom()
                }));
        },
        zoomend: (test: any) => {
            setSearchParams((params)=>({
                    ...Object.fromEntries(params),
                    zoom: test.target.getZoom()
                }));
        }
    });
    return null;
};
var $41a820134d906e83$export$2e2bcd8739ae039 = $41a820134d906e83$var$QueryStringUpdater;









// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $845cccf8fd290d00$var$useStyles = (0, $4dBGn$muistylesmakeStyles)(()=>({
        closeButton: {
            position: 'absolute',
            zIndex: 1400,
            top: 0,
            right: 0
        }
    }));
// @ts-expect-error TS(7031): Binding element 'popupContent' implicitly has an '... Remove this comment to see the full error message
const $845cccf8fd290d00$var$MobileDrawer = ({ popupContent: popupContent, onClose: onClose })=>{
    const classes = $845cccf8fd290d00$var$useStyles();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $4dBGn$useRecordContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const map = (0, $4dBGn$useMap)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    (0, $4dBGn$useEffect)(()=>{
        if (record) map.setView([
            record.latitude,
            record.longitude
        ]);
    }, [
        record,
        map
    ]);
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Drawer), {
        anchor: "bottom",
        open: !!record,
        onClose: onClose,
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        children: /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$Box), {
            p: 1,
            position: "relative",
            children: [
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$IconButton), {
                    onClick: onClose,
                    className: classes.closeButton,
                    size: "large",
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    children: /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$muiiconsmaterialClear), {})
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $4dBGn$react).createElement(popupContent)
            ]
        })
    });
};
var $845cccf8fd290d00$export$2e2bcd8739ae039 = $845cccf8fd290d00$var$MobileDrawer;


// @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
const $6ec4ba22c7861081$var$useStyles = (0, $4dBGn$muistylesmakeStyles)(()=>({
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
const $6ec4ba22c7861081$var$MapList = ({ latitude: latitude, longitude: longitude, label: label, description: description, popupContent: popupContent = (0, $0af94055ba27b10f$export$2e2bcd8739ae039), height: height = 700, center: center = [
    47,
    2.213749
// @ts-expect-error TS(7031): Binding element 'boundToMarkers' implicitly has an... Remove this comment to see the full error message
], zoom: zoom = 6, groupClusters: groupClusters = true, boundToMarkers: boundToMarkers, connectMarkers: connectMarkers = false, scrollWheelZoom: scrollWheelZoom = false, ...otherProps })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const { data: data, isLoading: isLoading } = (0, $4dBGn$useListContext)();
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const xs = (0, $4dBGn$useMediaQuery)((theme)=>theme.breakpoints.down('sm'), {
        noSsr: true
    });
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const [drawerRecord, setDrawerRecord] = (0, $4dBGn$useState)(null);
    const classes = $6ec4ba22c7861081$var$useStyles();
    // Get the zoom and center from query string, if available
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const location = (0, $4dBGn$useLocation)();
    const query = new URLSearchParams(location.search);
    // @ts-expect-error TS(2322): Type 'number[] | (string | null)[]' is not assigna... Remove this comment to see the full error message
    center = query.has('lat') && query.has('lng') ? [
        query.get('lat'),
        query.get('lng')
    ] : center;
    // @ts-expect-error TS(2322): Type 'string | number | null' is not assignable to... Remove this comment to see the full error message
    zoom = query.has('zoom') ? query.get('zoom') : zoom;
    let previousRecord: any;
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    const records = isLoading ? [] : data.map((record)=>({
            ...record,
            latitude: latitude && latitude(record),
            longitude: longitude && longitude(record),
            label: label && label(record),
            description: description && description(record)
        })).filter((record)=>record.latitude && record.longitude);
    const bounds = boundToMarkers && records.length > 0 ? records.map((record)=>[
            record.latitude,
            record.longitude
        ]) : undefined;
    // Do not display anything if the bounds are not ready, otherwise the MapContainer will not be initialized correctly
    if (boundToMarkers && !bounds) return null;
    const markers = records.map((record, i)=>{
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        const marker = /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$react).Fragment, {
            children: [
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Marker), {
                    position: [
                        record.latitude,
                        record.longitude
                    ],
                    eventHandlers: xs ? {
                        click: ()=>setDrawerRecord(record)
                    } : undefined,
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    children: !xs && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Popup), {
                        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                        children: /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$RecordContextProvider), {
                            value: record,
                            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                            children: /*#__PURE__*/ (0, $4dBGn$react).createElement(popupContent)
                        })
                    })
                }),
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                connectMarkers && previousRecord && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Polyline), {
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
    return /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$MapContainer), {
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
            /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$TileLayer), {
                attribution: '\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            isLoading && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Box), {
                alignItems: "center",
                className: classes.isLoading,
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                children: /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$muimaterialCircularProgress), {
                    size: 60,
                    thickness: 6
                })
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            groupClusters ? /*#__PURE__*/ (0, $4dBGn$jsx)((0, $30b7ce6cee91ee5d$export$2e2bcd8739ae039), {
                showCoverageOnHover: false,
                children: markers
            }) : markers,
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $4dBGn$jsx)((0, $41a820134d906e83$export$2e2bcd8739ae039), {}),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$RecordContextProvider), {
                value: drawerRecord,
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                children: /*#__PURE__*/ (0, $4dBGn$jsx)((0, $845cccf8fd290d00$export$2e2bcd8739ae039), {
                    popupContent: popupContent,
                    onClose: ()=>setDrawerRecord(null)
                })
            })
        ]
    });
};
var $6ec4ba22c7861081$export$2e2bcd8739ae039 = $6ec4ba22c7861081$var$MapList;









// @ts-expect-error TS(7031): Binding element 'center' implicitly has an 'any' t... Remove this comment to see the full error message
const $48abf5ed53d78299$var$ChangeView = ({ center: center, zoom: zoom })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const map = (0, $4dBGn$useMap)();
    map.setView(center, zoom);
    return null;
};
var $48abf5ed53d78299$export$2e2bcd8739ae039 = $48abf5ed53d78299$var$ChangeView;


// @ts-expect-error TS(7031): Binding element 'latitude' implicitly has an 'any'... Remove this comment to see the full error message
const $c0e51b97cc9ee3d2$var$MapField = ({ latitude: latitude, longitude: longitude, address: address, height: height = 400, zoom: zoom = 11, typographyProps: typographyProps, ...rest })=>{
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    const record = (0, $4dBGn$useRecordContext)();
    const position = [
        latitude(record),
        longitude(record)
    ];
    // Do not display the component if it has no latitude or longitude
    if (!position[0] || !position[1]) return null;
    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
    return /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$Box), {
        children: [
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            address && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Box), {
                mt: 1,
                mb: 1,
                // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                children: /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Typography), {
                    ...typographyProps,
                    children: address(record)
                })
            }),
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$MapContainer), {
                style: {
                    height: height
                },
                center: position,
                zoom: zoom,
                ...rest,
                children: [
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $4dBGn$jsx)((0, $48abf5ed53d78299$export$2e2bcd8739ae039), {
                        center: position
                    }),
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$TileLayer), {
                        attribution: '\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }),
                    // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
                    /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Marker), {
                        position: position
                    })
                ]
            })
        ]
    });
};
var $c0e51b97cc9ee3d2$export$2e2bcd8739ae039 = $c0e51b97cc9ee3d2$var$MapField;




export {$85f5b044a3dfefc9$export$2e2bcd8739ae039 as extractContext, $30efcd78e923a66d$export$2e2bcd8739ae039 as LocationInput, $6ec4ba22c7861081$export$2e2bcd8739ae039 as MapList, $c0e51b97cc9ee3d2$export$2e2bcd8739ae039 as MapField};
//# sourceMappingURL=index.es.js.map
