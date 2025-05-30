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


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "extractContext", () => $afab6c0f6ffa522c$export$2e2bcd8739ae039);
$parcel$export(module.exports, "LocationInput", () => $7a57fad6c56283a6$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MapList", () => $3929b9df2dd76406$export$2e2bcd8739ae039);
$parcel$export(module.exports, "MapField", () => $7855b7e2551c6d96$export$2e2bcd8739ae039);
const $afab6c0f6ffa522c$var$extractContext = (context, key)=>{
    const property = context.find((property)=>property.id.startsWith(`${key}.`));
    if (property) return property.text;
};
var $afab6c0f6ffa522c$export$2e2bcd8739ae039 = $afab6c0f6ffa522c$var$extractContext;












const $7a57fad6c56283a6$var$StyledLocationOnIcon = (0, $CiwlJ$muisystem.styled)((0, ($parcel$interopDefault($CiwlJ$muiiconsmaterialLocationOn))))(({ theme: theme })=>({
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2)
    }));
const $7a57fad6c56283a6$var$selectOptionText = (option, optionText)=>{
    if (option.place_name) return option.place_name;
    if (typeof optionText === 'string') return option[optionText];
    if (typeof optionText === 'function') return optionText(option);
};
const $7a57fad6c56283a6$var$LocationInput = ({ mapboxConfig: mapboxConfig, source: source, label: label, parse: parse, optionText: optionText, helperText: helperText, variant: variant = 'outlined', size: size = 'small', ...rest })=>{
    if (!mapboxConfig) throw new Error('@semapps/geo-components : No mapbox configuration');
    if (!mapboxConfig.access_token) throw new Error('@semapps/geo-components : No access token in mapbox configuration');
    const record = (0, $CiwlJ$reactadmin.useRecordContext)();
    const resource = (0, $CiwlJ$reactadmin.useResourceContext)();
    const locale = (0, $CiwlJ$reactadmin.useLocale)();
    const translate = (0, $CiwlJ$reactadmin.useTranslate)();
    const [keyword, setKeyword] = (0, $CiwlJ$react.useState)(''); // Typed keywords
    const [options, setOptions] = (0, $CiwlJ$react.useState)([]); // Options returned by MapBox
    // Do not pass the `parse` prop to useInput, as we manually call it on the onChange prop below
    const { field: { value: value, onChange: onChange, onBlur: onBlur /* , onFocus */  }, isRequired: isRequired, fieldState: { error: error, isTouched: /* submitError, */ isTouched } } = (0, $CiwlJ$reactadmin.useInput)({
        resource: resource,
        source: source,
        ...rest
    });
    const fetchMapbox = (0, $CiwlJ$react.useMemo)(()=>(0, ($parcel$interopDefault($CiwlJ$lodashthrottle)))((keyword, callback)=>{
            const fetchUrl = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${keyword}.json`);
            // Use locale as default language
            if (!mapboxConfig.language) mapboxConfig.language = locale;
            // All options available at https://docs.mapbox.com/api/search/geocoding/#forward-geocoding
            Object.entries(mapboxConfig).forEach(([key, value])=>{
                if (Array.isArray(value)) value = value.join(',');
                else if (typeof value === 'boolean') value = value ? 'true' : 'false';
                fetchUrl.searchParams.set(key, value);
            });
            fetch(fetchUrl.toString()).then((res)=>res.json()).then((json)=>callback(json));
        }, 200), [
        mapboxConfig,
        locale
    ]);
    (0, $CiwlJ$react.useEffect)(()=>{
        // Do not trigger search if text input is empty or if it is the same as the current value
        if (!keyword || keyword === $7a57fad6c56283a6$var$selectOptionText(value, optionText)) return undefined;
        fetchMapbox(keyword, (results)=>setOptions(results.features));
    }, [
        value,
        keyword,
        fetchMapbox
    ]);
    return /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, ($parcel$interopDefault($CiwlJ$muimaterialAutocomplete))), {
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
        getOptionLabel: (option)=>$7a57fad6c56283a6$var$selectOptionText(option, optionText),
        isOptionEqualToValue: (option, value)=>$7a57fad6c56283a6$var$selectOptionText(option, optionText) === $7a57fad6c56283a6$var$selectOptionText(value, optionText),
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
            return /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.TextField), {
                ...params,
                inputProps: {
                    ...params.inputProps,
                    onBlur: (e)=>{
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
                label: label !== '' && label !== false && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactadmin.FieldTitle), {
                    label: label,
                    source: source,
                    resource: resource,
                    isRequired: isRequired
                }),
                error: !!(isTouched && error),
                helperText: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactadmin.InputHelperText), {
                    touched: isTouched,
                    error: error /* || submitError */ ,
                    helperText: helperText
                }),
                ...rest
            });
        },
        renderOption: (props, option, state)=>{
            const matches = (0, ($parcel$interopDefault($CiwlJ$autosuggesthighlightmatch)))(option.text, keyword);
            const parts = (0, ($parcel$interopDefault($CiwlJ$autosuggesthighlightparse)))(option.text, matches);
            return /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)("li", {
                ...props,
                children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, $CiwlJ$muimaterial.Grid), {
                    container: true,
                    alignItems: "center",
                    children: [
                        /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Grid), {
                            item: true,
                            children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)($7a57fad6c56283a6$var$StyledLocationOnIcon, {})
                        }),
                        /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, $CiwlJ$muimaterial.Grid), {
                            item: true,
                            xs: true,
                            children: [
                                typeof parts === 'string' ? parts : parts.map((part, index)=>/*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)("span", {
                                        style: {
                                            fontWeight: part.highlight ? 700 : 400
                                        },
                                        children: part.text
                                    }, index)),
                                /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Typography), {
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
var $7a57fad6c56283a6$export$2e2bcd8739ae039 = $7a57fad6c56283a6$var$LocationInput;














// Taken from https://github.com/changey/react-leaflet-markercluster/blob/60992857087c181ada1e8e6659a6666a13c1f868/src/react-leaflet-markercluster.js
function $7390fd757b2ce4b0$var$createMarkerCluster({ children: _c, ...props }, context) {
    const clusterProps = {};
    const clusterEvents = {};
    // Splitting props and events to different objects
    Object.entries(props).forEach(([propName, prop])=>propName.startsWith('on') ? clusterEvents[propName] = prop : clusterProps[propName] = prop);
    const instance = new (0, ($parcel$interopDefault($CiwlJ$leaflet))).MarkerClusterGroup(clusterProps);
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
const $7390fd757b2ce4b0$var$MarkerClusterGroup = (0, $CiwlJ$reactleafletcore.createPathComponent)($7390fd757b2ce4b0$var$createMarkerCluster);
var $7390fd757b2ce4b0$export$2e2bcd8739ae039 = $7390fd757b2ce4b0$var$MarkerClusterGroup;






const $e9a08b6b577904d6$var$DefaultPopupContent = ()=>{
    const record = (0, $CiwlJ$reactadmin.useRecordContext)();
    const resourceDefinition = (0, $CiwlJ$reactadmin.useResourceDefinition)({});
    if (!record) return null;
    return /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, $CiwlJ$reactjsxruntime.Fragment), {
        children: [
            record.label && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Typography), {
                variant: "h5",
                children: record.label
            }),
            record.description && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Typography), {
                children: record.description.length > 150 ? `${record.description.substring(0, 150)}...` : record.description
            }),
            resourceDefinition.hasShow && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactadmin.ShowButton), {}),
            resourceDefinition.hasEdit && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactadmin.EditButton), {})
        ]
    });
};
var $e9a08b6b577904d6$export$2e2bcd8739ae039 = $e9a08b6b577904d6$var$DefaultPopupContent;




// Keep the zoom and center in query string, so that when we navigate back to the page, it stays focused on the same area
const $4340bf725cfbb626$var$QueryStringUpdater = ()=>{
    const [searchParams, setSearchParams] = (0, $CiwlJ$reactrouterdom.useSearchParams)();
    (0, $CiwlJ$reactleaflet.useMapEvents)({
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
var $4340bf725cfbb626$export$2e2bcd8739ae039 = $4340bf725cfbb626$var$QueryStringUpdater;









const $31c59492060af504$var$useStyles = (0, ($parcel$interopDefault($CiwlJ$muistylesmakeStyles)))(()=>({
        closeButton: {
            position: 'absolute',
            zIndex: 1400,
            top: 0,
            right: 0
        }
    }));
const $31c59492060af504$var$MobileDrawer = ({ popupContent: popupContent, onClose: onClose })=>{
    const classes = $31c59492060af504$var$useStyles();
    const record = (0, $CiwlJ$reactadmin.useRecordContext)();
    const map = (0, $CiwlJ$reactleaflet.useMap)();
    (0, $CiwlJ$react.useEffect)(()=>{
        if (record) map.setView([
            record.latitude,
            record.longitude
        ]);
    }, [
        record,
        map
    ]);
    return /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Drawer), {
        anchor: "bottom",
        open: !!record,
        onClose: onClose,
        children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, $CiwlJ$muimaterial.Box), {
            p: 1,
            position: "relative",
            children: [
                /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.IconButton), {
                    onClick: onClose,
                    className: classes.closeButton,
                    size: "large",
                    children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, ($parcel$interopDefault($CiwlJ$muiiconsmaterialClear))), {})
                }),
                /*#__PURE__*/ (0, ($parcel$interopDefault($CiwlJ$react))).createElement(popupContent)
            ]
        })
    });
};
var $31c59492060af504$export$2e2bcd8739ae039 = $31c59492060af504$var$MobileDrawer;


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
const $3929b9df2dd76406$var$MapList = ({ latitude: latitude, longitude: longitude, label: label, description: description, popupContent: popupContent = (0, $e9a08b6b577904d6$export$2e2bcd8739ae039), height: height = 700, center: center = [
    47,
    2.213749
], zoom: zoom = 6, groupClusters: groupClusters = true, boundToMarkers: boundToMarkers, connectMarkers: connectMarkers = false, scrollWheelZoom: scrollWheelZoom = false, ...otherProps })=>{
    const { data: data, isLoading: isLoading } = (0, $CiwlJ$reactadmin.useListContext)();
    const xs = (0, $CiwlJ$muimaterial.useMediaQuery)((theme)=>theme.breakpoints.down('sm'), {
        noSsr: true
    });
    const [drawerRecord, setDrawerRecord] = (0, $CiwlJ$react.useState)(null);
    const classes = $3929b9df2dd76406$var$useStyles();
    // Get the zoom and center from query string, if available
    const location = (0, $CiwlJ$reactrouterdom.useLocation)();
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
        const marker = /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, ($parcel$interopDefault($CiwlJ$react))).Fragment, {
            children: [
                /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactleaflet.Marker), {
                    position: [
                        record.latitude,
                        record.longitude
                    ],
                    eventHandlers: xs ? {
                        click: ()=>setDrawerRecord(record)
                    } : undefined,
                    children: !xs && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactleaflet.Popup), {
                        children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactadmin.RecordContextProvider), {
                            value: record,
                            children: /*#__PURE__*/ (0, ($parcel$interopDefault($CiwlJ$react))).createElement(popupContent)
                        })
                    })
                }),
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
            /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactleaflet.TileLayer), {
                attribution: '\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }),
            isLoading && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Box), {
                alignItems: "center",
                className: classes.isLoading,
                children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, ($parcel$interopDefault($CiwlJ$muimaterialCircularProgress))), {
                    size: 60,
                    thickness: 6
                })
            }),
            groupClusters ? /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $7390fd757b2ce4b0$export$2e2bcd8739ae039), {
                showCoverageOnHover: false,
                children: markers
            }) : markers,
            /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $4340bf725cfbb626$export$2e2bcd8739ae039), {}),
            /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactadmin.RecordContextProvider), {
                value: drawerRecord,
                children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $31c59492060af504$export$2e2bcd8739ae039), {
                    popupContent: popupContent,
                    onClose: ()=>setDrawerRecord(null)
                })
            })
        ]
    });
};
var $3929b9df2dd76406$export$2e2bcd8739ae039 = $3929b9df2dd76406$var$MapList;









const $a907502a25565c32$var$ChangeView = ({ center: center, zoom: zoom })=>{
    const map = (0, $CiwlJ$reactleaflet.useMap)();
    map.setView(center, zoom);
    return null;
};
var $a907502a25565c32$export$2e2bcd8739ae039 = $a907502a25565c32$var$ChangeView;


const $7855b7e2551c6d96$var$MapField = ({ latitude: latitude, longitude: longitude, address: address, height: height = 400, zoom: zoom = 11, typographyProps: typographyProps, ...rest })=>{
    const record = (0, $CiwlJ$reactadmin.useRecordContext)();
    const position = [
        latitude(record),
        longitude(record)
    ];
    // Do not display the component if it has no latitude or longitude
    if (!position[0] || !position[1]) return null;
    return /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, $CiwlJ$muimaterial.Box), {
        children: [
            address && /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Box), {
                mt: 1,
                mb: 1,
                children: /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$muimaterial.Typography), {
                    ...typographyProps,
                    children: address(record)
                })
            }),
            /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsxs)((0, $CiwlJ$reactleaflet.MapContainer), {
                style: {
                    height: height
                },
                center: position,
                zoom: zoom,
                ...rest,
                children: [
                    /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $a907502a25565c32$export$2e2bcd8739ae039), {
                        center: position
                    }),
                    /*#__PURE__*/ (0, $CiwlJ$reactjsxruntime.jsx)((0, $CiwlJ$reactleaflet.TileLayer), {
                        attribution: '\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }),
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
