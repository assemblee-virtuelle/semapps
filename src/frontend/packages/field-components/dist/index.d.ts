import { JSX } from 'react/jsx-runtime';
export function AvatarWithLabelField({
  label,
  defaultLabel,
  image,
  fallback,
  externalLink,
  labelColor,
  classes,
  ...rest
}: {
  [x: string]: any;
  label: any;
  defaultLabel: any;
  image: any;
  fallback: any;
  externalLink?: boolean | undefined;
  labelColor?: string | undefined;
  classes: any;
}): JSX.Element;
export function ReferenceArrayField({ source, ...otherProps }: { [x: string]: any; source: any }): JSX.Element;
export function ReferenceField({ source, ...otherProps }: { [x: string]: any; source: any }): JSX.Element;
export function QuickAppendReferenceArrayField({
  reference,
  source,
  resource,
  children,
  ...otherProps
}: {
  [x: string]: any;
  reference: any;
  source: any;
  resource: any;
  children: any;
}): JSX.Element;
export function MultiUrlField({ source, domainMapping }: { source: any; domainMapping: any }): any;
export function SeparatedListField(props: any): JSX.Element;

//# sourceMappingURL=index.d.ts.map
