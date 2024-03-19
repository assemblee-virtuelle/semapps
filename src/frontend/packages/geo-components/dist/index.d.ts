export function extractContext(context: any, key: any): any;
declare namespace LocationInput {
  namespace defaultProps {
    let variant: string;
    let size: string;
  }
}
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
  ...otherProps
}: {
  [x: string]: any;
  latitude: any;
  longitude: any;
  label: any;
  description: any;
  popupContent: any;
  height: any;
  center: any;
  zoom: any;
  groupClusters: any;
  boundToMarkers: any;
  connectMarkers: any;
}): import('react/jsx-runtime').JSX.Element | null;
declare namespace MapList {
  namespace defaultProps {
    export let height: number;
    export let center: number[];
    export let zoom: number;
    export let groupClusters: boolean;
    export let connectMarkers: boolean;
    export let scrollWheelZoom: boolean;
    export { DefaultPopupContent as popupContent };
  }
}
export function MapField({
  latitude,
  longitude,
  address,
  height,
  typographyProps,
  ...rest
}: {
  [x: string]: any;
  latitude: any;
  longitude: any;
  address: any;
  height: any;
  typographyProps: any;
}): import('react/jsx-runtime').JSX.Element | null;
declare namespace MapField {
  namespace defaultProps {
    let height: number;
    let zoom: number;
  }
}

//# sourceMappingURL=index.d.ts.map
