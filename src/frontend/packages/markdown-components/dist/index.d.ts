import { FunctionComponent } from 'react';
import { ReactMdeProps } from 'react-mde';
import { MarkdownToJSX } from 'markdown-to-jsx';
import { TextInputProps } from 'react-admin';
export function MarkdownField({
  source,
  LabelComponent,
  overrides,
  ...rest
}: {
  [x: string]: any;
  source: any;
  LabelComponent?: string | undefined;
  overrides?: {} | undefined;
}): import('react/jsx-runtime').JSX.Element | null;
type Props = TextInputProps & {
  overrides?: MarkdownToJSX.Overrides;
  reactMdeProps?: ReactMdeProps;
};
export const MarkdownInput: FunctionComponent<Props>;
export function useLoadLinks(
  resourceType: any,
  labelProp: any
): (keyword: any) => Promise<
  {
    preview: any;
    value: string;
  }[]
>;

//# sourceMappingURL=index.d.ts.map
