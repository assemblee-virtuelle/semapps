import { JSX } from 'react/jsx-runtime';
export function extractContext(context: any, key: any): any;
export function LocationInput({
  mapboxConfig,
  source,
  label,
  parse,
  optionText,
  helperText,
  variant,
  size,
  ...rest
}: {
  [x: string]: any;
  mapboxConfig: any;
  source: any;
  label: any;
  parse: any;
  optionText: any;
  helperText: any;
  variant?: string | undefined;
  size?: string | undefined;
}): JSX.Element;
export function MapList({
  latitude,
  longitude,
  label,
  description,
  popupContent,
  height,
  center,
  zoom,
  groupClusters,
  boundToMarkers,
  connectMarkers,
  scrollWheelZoom,
  ...otherProps
}: {
  [x: string]: any;
  latitude: any;
  longitude: any;
  label: any;
  description: any;
  popupContent?: (() => JSX.Element | null) | undefined;
  height?: number | undefined;
  center?: number[] | undefined;
  zoom?: number | undefined;
  groupClusters?: boolean | undefined;
  boundToMarkers: any;
  connectMarkers?: boolean | undefined;
  scrollWheelZoom?: boolean | undefined;
}): JSX.Element | null;
export function MapField({
  latitude,
  longitude,
  address,
  height,
  zoom,
  typographyProps,
  ...rest
}: {
  [x: string]: any;
  latitude: any;
  longitude: any;
  address: any;
  height?: number | undefined;
  zoom?: number | undefined;
  typographyProps: any;
}): JSX.Element | null;

//# sourceMappingURL=index.d.ts.map
