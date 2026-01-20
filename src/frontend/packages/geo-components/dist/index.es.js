import {jsx as $4dBGn$jsx, jsxs as $4dBGn$jsxs, Fragment as $4dBGn$Fragment} from "react/jsx-runtime";
import $4dBGn$react, {useState as $4dBGn$useState, useMemo as $4dBGn$useMemo, useEffect as $4dBGn$useEffect} from "react";
import {useRecordContext as $4dBGn$useRecordContext, useResourceContext as $4dBGn$useResourceContext, useLocale as $4dBGn$useLocale, useTranslate as $4dBGn$useTranslate, useInput as $4dBGn$useInput, FieldTitle as $4dBGn$FieldTitle, InputHelperText as $4dBGn$InputHelperText, useListContext as $4dBGn$useListContext, RecordContextProvider as $4dBGn$RecordContextProvider, useResourceDefinition as $4dBGn$useResourceDefinition, ShowButton as $4dBGn$ShowButton, EditButton as $4dBGn$EditButton} from "react-admin";
import {TextField as $4dBGn$TextField, Grid as $4dBGn$Grid, Typography as $4dBGn$Typography, useMediaQuery as $4dBGn$useMediaQuery, Box as $4dBGn$Box, Drawer as $4dBGn$Drawer, IconButton as $4dBGn$IconButton} from "@mui/material";
import $4dBGn$muimaterialAutocomplete from "@mui/material/Autocomplete";
import $4dBGn$muiiconsmaterialLocationOn from "@mui/icons-material/LocationOn";
import $4dBGn$autosuggesthighlightmatch from "autosuggest-highlight/match";
import $4dBGn$autosuggesthighlightparse from "autosuggest-highlight/parse";
import $4dBGn$lodashthrottle from "lodash.throttle";
import {styled as $4dBGn$styled} from "@mui/system";
import {useLocation as $4dBGn$useLocation, useSearchParams as $4dBGn$useSearchParams} from "react-router-dom";
import {makeStyles as $4dBGn$makeStyles} from "tss-react/mui";
import $4dBGn$muimaterialCircularProgress from "@mui/material/CircularProgress";
import "leaflet-defaulticon-compatibility";
import {Marker as $4dBGn$Marker, Popup as $4dBGn$Popup, Polyline as $4dBGn$Polyline, MapContainer as $4dBGn$MapContainer, TileLayer as $4dBGn$TileLayer, useMapEvents as $4dBGn$useMapEvents, useMap as $4dBGn$useMap} from "react-leaflet";
import $4dBGn$leaflet from "leaflet";
import {createPathComponent as $4dBGn$createPathComponent} from "@react-leaflet/core";
import "leaflet.markercluster";
import $4dBGn$muiiconsmaterialClear from "@mui/icons-material/Clear";

const $81d2e971b5b76f17$var$extractContext = (context, key)=>{
    const property = context.find((property)=>property.id.startsWith(`${key}.`));
    if (property) return property.text;
};
var $81d2e971b5b76f17$export$2e2bcd8739ae039 = $81d2e971b5b76f17$var$extractContext;












const $987f89af98b5a0b6$var$StyledLocationOnIcon = (0, $4dBGn$styled)((0, $4dBGn$muiiconsmaterialLocationOn))(({ theme: theme })=>({
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2)
    }));
const $987f89af98b5a0b6$var$selectOptionText = (option, optionText)=>{
    if (option.place_name) return option.place_name;
    if (typeof optionText === 'string') return option[optionText];
    if (typeof optionText === 'function') return optionText(option);
};
const $987f89af98b5a0b6$var$LocationInput = ({ mapboxConfig: mapboxConfig, source: source, label: label, parse: parse, optionText: optionText, helperText: helperText, variant: variant = 'outlined', size: size = 'small', ...rest })=>{
    if (!mapboxConfig) throw new Error('@semapps/geo-components : No mapbox configuration');
    if (!mapboxConfig.access_token) throw new Error('@semapps/geo-components : No access token in mapbox configuration');
    const record = (0, $4dBGn$useRecordContext)();
    const resource = (0, $4dBGn$useResourceContext)();
    const locale = (0, $4dBGn$useLocale)();
    const translate = (0, $4dBGn$useTranslate)();
    const [keyword, setKeyword] = (0, $4dBGn$useState)(''); // Typed keywords
    const [options, setOptions] = (0, $4dBGn$useState)([]); // Options returned by MapBox
    // Do not pass the `parse` prop to useInput, as we manually call it on the onChange prop below
    const { field: { value: value, onChange: onChange, onBlur: onBlur /* , onFocus */  }, isRequired: isRequired, fieldState: { error: error, isTouched: /* submitError, */ isTouched } } = (0, $4dBGn$useInput)({
        resource: resource,
        source: source,
        ...rest
    });
    const fetchMapbox = (0, $4dBGn$useMemo)(()=>(0, $4dBGn$lodashthrottle)((keyword, callback)=>{
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
    (0, $4dBGn$useEffect)(()=>{
        // Do not trigger search if text input is empty or if it is the same as the current value
        if (!keyword || keyword === $987f89af98b5a0b6$var$selectOptionText(value, optionText)) return undefined;
        fetchMapbox(keyword, (results)=>setOptions(results.features));
    }, [
        value,
        keyword,
        fetchMapbox
    ]);
    return /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$muimaterialAutocomplete), {
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
        filterOptions: (x)=>x,
        getOptionLabel: (option)=>$987f89af98b5a0b6$var$selectOptionText(option, optionText),
        isOptionEqualToValue: (option, value)=>$987f89af98b5a0b6$var$selectOptionText(option, optionText) === $987f89af98b5a0b6$var$selectOptionText(value, optionText),
        // This function is called when the user selects an option
        onChange: (event, newValue)=>{
            // Parse only if the value is not null (happens if the user clears the value)
            if (newValue && parse) newValue = parse(newValue);
            onChange(newValue);
            setOptions([]);
        },
        onInputChange: (event, newKeyword)=>setKeyword(newKeyword),
        noOptionsText: translate('ra.navigation.no_results'),
        renderInput: (params)=>{
            // Autocomplete=off doesn't work anymore in modern browsers
            // https://stackoverflow.com/a/40791726/7900695
            params.inputProps.autoComplete = 'new-password';
            return /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$TextField), {
                ...params,
                inputProps: {
                    ...params.inputProps,
                    onBlur: (e)=>{
                        onBlur(e);
                        if (params.inputProps.onBlur) // @ts-expect-error TS(2345): Argument of type 'FocusEvent<HTMLInputElement | HT... Remove this comment to see the full error message
                        params.inputProps.onBlur(e);
                    } /* ,
              onFocus: e => {
                onFocus(e);
                if (params.inputProps.onFocus) {
                  params.inputProps.onFocus(e);
                }
              } */ 
                },
                label: label !== '' && label !== false && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$FieldTitle), {
                    label: label,
                    source: source,
                    resource: resource,
                    isRequired: isRequired
                }),
                error: !!(isTouched && error),
                helperText: // @ts-expect-error TS(2322): Type 'FieldError | undefined' is not assignable to... Remove this comment to see the full error message
                /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$InputHelperText), {
                    touched: isTouched,
                    error: error /* || submitError */ ,
                    helperText: helperText
                }),
                ...rest
            });
        },
        renderOption: (props, option, state)=>{
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            const matches = (0, $4dBGn$autosuggesthighlightmatch)(option.text, keyword);
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            const parts = (0, $4dBGn$autosuggesthighlightparse)(option.text, matches);
            return /*#__PURE__*/ (0, $4dBGn$jsx)("li", {
                ...props,
                children: /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$Grid), {
                    container: true,
                    alignItems: "center",
                    children: [
                        /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Grid), {
                            item: true,
                            children: /*#__PURE__*/ (0, $4dBGn$jsx)($987f89af98b5a0b6$var$StyledLocationOnIcon, {})
                        }),
                        /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$Grid), {
                            item: true,
                            xs: true,
                            children: [
                                typeof parts === 'string' ? parts : parts.map((part, index)=>/*#__PURE__*/ (0, $4dBGn$jsx)("span", {
                                        style: {
                                            fontWeight: part.highlight ? 700 : 400
                                        },
                                        children: part.text
                                    }, index)),
                                /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Typography), {
                                    variant: "body2",
                                    color: "textSecondary",
                                    children: option.place_name
                                })
                            ]
                        })
                    ]
                })
            });
        },
        variant: variant,
        size: size,
        ...rest
    });
};
var $987f89af98b5a0b6$export$2e2bcd8739ae039 = $987f89af98b5a0b6$var$LocationInput;














// Taken from https://github.com/changey/react-leaflet-markercluster/blob/60992857087c181ada1e8e6659a6666a13c1f868/src/react-leaflet-markercluster.js
// @ts-expect-error TS(7031): Binding element '_c' implicitly has an 'any' type.
function $3be63165004362ea$var$createMarkerCluster({ children: _c, ...props }, context) {
    const clusterProps = {};
    const clusterEvents = {};
    // Splitting props and events to different objects
    Object.entries(props).forEach(([propName, prop])=>// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        propName.startsWith('on') ? clusterEvents[propName] = prop : clusterProps[propName] = prop);
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
const $3be63165004362ea$var$MarkerClusterGroup = (0, $4dBGn$createPathComponent)($3be63165004362ea$var$createMarkerCluster);
var $3be63165004362ea$export$2e2bcd8739ae039 = $3be63165004362ea$var$MarkerClusterGroup;






const $78579d5eeb4ac689$var$DefaultPopupContent = ()=>{
    const record = (0, $4dBGn$useRecordContext)();
    const resourceDefinition = (0, $4dBGn$useResourceDefinition)({});
    if (!record) return null;
    return /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$Fragment), {
        children: [
            record.label && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Typography), {
                variant: "h5",
                children: record.label
            }),
            record.description && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Typography), {
                children: record.description.length > 150 ? `${record.description.substring(0, 150)}...` : record.description
            }),
            resourceDefinition.hasShow && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$ShowButton), {}),
            resourceDefinition.hasEdit && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$EditButton), {})
        ]
    });
};
var $78579d5eeb4ac689$export$2e2bcd8739ae039 = $78579d5eeb4ac689$var$DefaultPopupContent;




// Keep the zoom and center in query string, so that when we navigate back to the page, it stays focused on the same area
const $cb9d4bbdbfa10423$var$QueryStringUpdater = ()=>{
    const [searchParams, setSearchParams] = (0, $4dBGn$useSearchParams)();
    (0, $4dBGn$useMapEvents)({
        moveend: (test)=>{
            setSearchParams((params)=>({
                    ...Object.fromEntries(params),
                    lat: test.target.getCenter().lat,
                    lng: test.target.getCenter().lng,
                    zoom: test.target.getZoom()
                }));
        },
        zoomend: (test)=>{
            setSearchParams((params)=>({
                    ...Object.fromEntries(params),
                    zoom: test.target.getZoom()
                }));
        }
    });
    return null;
};
var $cb9d4bbdbfa10423$export$2e2bcd8739ae039 = $cb9d4bbdbfa10423$var$QueryStringUpdater;









const $5f1b540baeb2942f$var$useStyles = (0, $4dBGn$makeStyles)()(()=>({
        closeButton: {
            position: 'absolute',
            zIndex: 1400,
            top: 0,
            right: 0
        }
    }));
const $5f1b540baeb2942f$var$MobileDrawer = ({ popupContent: popupContent, onClose: onClose })=>{
    const { classes: classes } = $5f1b540baeb2942f$var$useStyles();
    const record = (0, $4dBGn$useRecordContext)();
    const map = (0, $4dBGn$useMap)();
    (0, $4dBGn$useEffect)(()=>{
        if (record) map.setView([
            record.latitude,
            record.longitude
        ]);
    }, [
        record,
        map
    ]);
    return /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Drawer), {
        anchor: "bottom",
        open: !!record,
        onClose: onClose,
        children: /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$Box), {
            p: 1,
            position: "relative",
            children: [
                /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$IconButton), {
                    onClick: onClose,
                    className: classes.closeButton,
                    size: "large",
                    children: /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$muiiconsmaterialClear), {})
                }),
                /*#__PURE__*/ (0, $4dBGn$react).createElement(popupContent)
            ]
        })
    });
};
var $5f1b540baeb2942f$export$2e2bcd8739ae039 = $5f1b540baeb2942f$var$MobileDrawer;


const $0a155f5c43a344bc$var$useStyles = (0, $4dBGn$makeStyles)()(()=>({
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
const $0a155f5c43a344bc$var$MapList = ({ latitude: latitude, longitude: longitude, label: label, description: description, popupContent: popupContent = (0, $78579d5eeb4ac689$export$2e2bcd8739ae039), height: height = 700, center: center = [
    47,
    2.213749
], zoom: zoom = 6, groupClusters: groupClusters = true, boundToMarkers: boundToMarkers, connectMarkers: connectMarkers = false, scrollWheelZoom: scrollWheelZoom = false, ...otherProps })=>{
    const { data: data, isLoading: isLoading } = (0, $4dBGn$useListContext)();
    const xs = (0, $4dBGn$useMediaQuery)((theme)=>theme.breakpoints.down('sm'), {
        noSsr: true
    });
    const [drawerRecord, setDrawerRecord] = (0, $4dBGn$useState)(null);
    const { classes: classes } = $0a155f5c43a344bc$var$useStyles();
    // Get the zoom and center from query string, if available
    const location = (0, $4dBGn$useLocation)();
    const query = new URLSearchParams(location.search);
    center = query.has('lat') && query.has('lng') ? [
        query.get('lat'),
        query.get('lng')
    ] : center;
    zoom = query.has('zoom') ? query.get('zoom') : zoom;
    let previousRecord;
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
        const marker = /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$react).Fragment, {
            children: [
                /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Marker), {
                    position: [
                        record.latitude,
                        record.longitude
                    ],
                    eventHandlers: xs ? {
                        click: ()=>setDrawerRecord(record)
                    } : undefined,
                    children: !xs && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Popup), {
                        children: /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$RecordContextProvider), {
                            value: record,
                            children: /*#__PURE__*/ (0, $4dBGn$react).createElement(popupContent)
                        })
                    })
                }),
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
            /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$TileLayer), {
                // @ts-expect-error TS(2322): Type '{ attribution: string; url: string; }' is no... Remove this comment to see the full error message
                attribution: '\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }),
            isLoading && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Box), {
                alignItems: "center",
                className: classes.isLoading,
                children: /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$muimaterialCircularProgress), {
                    size: 60,
                    thickness: 6
                })
            }),
            groupClusters ? /*#__PURE__*/ (0, $4dBGn$jsx)((0, $3be63165004362ea$export$2e2bcd8739ae039), {
                showCoverageOnHover: false,
                children: markers
            }) : markers,
            /*#__PURE__*/ (0, $4dBGn$jsx)((0, $cb9d4bbdbfa10423$export$2e2bcd8739ae039), {}),
            /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$RecordContextProvider), {
                // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'RaRecord<Id... Remove this comment to see the full error message
                value: drawerRecord,
                children: /*#__PURE__*/ (0, $4dBGn$jsx)((0, $5f1b540baeb2942f$export$2e2bcd8739ae039), {
                    popupContent: popupContent,
                    onClose: ()=>setDrawerRecord(null)
                })
            })
        ]
    });
};
var $0a155f5c43a344bc$export$2e2bcd8739ae039 = $0a155f5c43a344bc$var$MapList;








const $b9c66387327bf06a$var$ChangeView = ({ center: center, zoom: zoom })=>{
    const map = (0, $4dBGn$useMap)();
    map.setView(center, zoom);
    return null;
};
var $b9c66387327bf06a$export$2e2bcd8739ae039 = $b9c66387327bf06a$var$ChangeView;


const $f35aae550b577387$var$MapField = ({ latitude: latitude, longitude: longitude, address: address, height: height = 400, zoom: zoom = 11, typographyProps: typographyProps, ...rest })=>{
    const record = (0, $4dBGn$useRecordContext)();
    const position = [
        latitude(record),
        longitude(record)
    ];
    // Do not display the component if it has no latitude or longitude
    if (!position[0] || !position[1]) return null;
    return /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$Box), {
        children: [
            address && /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Box), {
                mt: 1,
                mb: 1,
                children: /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Typography), {
                    ...typographyProps,
                    children: address(record)
                })
            }),
            /*#__PURE__*/ (0, $4dBGn$jsxs)((0, $4dBGn$MapContainer), {
                style: {
                    height: height
                },
                center: position,
                zoom: zoom,
                ...rest,
                children: [
                    /*#__PURE__*/ (0, $4dBGn$jsx)((0, $b9c66387327bf06a$export$2e2bcd8739ae039), {
                        center: position
                    }),
                    /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$TileLayer), {
                        // @ts-expect-error TS(2322): Type '{ attribution: string; url: string; }' is no... Remove this comment to see the full error message
                        attribution: '\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }),
                    /*#__PURE__*/ (0, $4dBGn$jsx)((0, $4dBGn$Marker), {
                        position: position
                    })
                ]
            })
        ]
    });
};
var $f35aae550b577387$export$2e2bcd8739ae039 = $f35aae550b577387$var$MapField;




export {$81d2e971b5b76f17$export$2e2bcd8739ae039 as extractContext, $987f89af98b5a0b6$export$2e2bcd8739ae039 as LocationInput, $0a155f5c43a344bc$export$2e2bcd8739ae039 as MapList, $f35aae550b577387$export$2e2bcd8739ae039 as MapField};
//# sourceMappingURL=index.es.js.map
