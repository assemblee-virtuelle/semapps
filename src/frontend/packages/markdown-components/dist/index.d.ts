import { JSX } from "react/jsx-runtime";
import { FunctionComponent } from "react";
import { ReactMdeProps } from "react-mde";
import { MarkdownToJSX } from "markdown-to-jsx";
import { TextInputProps } from "react-admin";
export const MarkdownField: ({ source, LabelComponent, overrides, ...rest }: any) => JSX.Element | null;
type Props = TextInputProps & {
    overrides?: MarkdownToJSX.Overrides;
    reactMdeProps?: ReactMdeProps;
};
export const MarkdownInput: FunctionComponent<Props>;
export const useLoadLinks: (resourceType: any, labelProp: any) => (keyword: any) => Promise<{
    preview: any;
    value: string;
}[]>;

//# sourceMappingURL=index.d.ts.map
