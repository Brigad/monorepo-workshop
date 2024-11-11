export type ResponsiveType<T> = T | [T, T] | [T, T, T];
export type ResponsiveTypeWithNone<T> = T | [T | "none", T | "none"] | [T | "none", T | "none", T | "none"];

export type FlexDirection = "row" | "column";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
export type JustifyContent = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";

export type AlignItems = "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
export type AlignSelf = AlignItems;
export type AlignContent = "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
export type Shadow = "shadow-elevation-high" | "shadow-elevation-normal" | "shadow-elevation-low";
export type Space = "small" | "medium" | "large";
export type FlexValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type TextAlign = "left" | "center" | "right" | "justify";

export type ResponsiveStyles =
  | Space
  | Shadow
  | FlexDirection
  | TextAlign
  | AlignItems
  | AlignSelf
  | AlignContent
  | JustifyContent
  | FlexWrap
  | FlexValue;

export type ResponsiveStylesObject = {
  gap?: ResponsiveTypeWithNone<Space>;
  rowGap?: ResponsiveTypeWithNone<Space>;
  columnGap?: ResponsiveTypeWithNone<Space>;
  margin?: ResponsiveTypeWithNone<Space>;
  marginHorizontal?: ResponsiveTypeWithNone<Space>;
  marginVertical?: ResponsiveTypeWithNone<Space>;
  marginTop?: ResponsiveTypeWithNone<Space>;
  marginBottom?: ResponsiveTypeWithNone<Space>;
  marginLeft?: ResponsiveTypeWithNone<Space>;
  marginRight?: ResponsiveTypeWithNone<Space>;
  padding?: ResponsiveTypeWithNone<Space>;
  paddingHorizontal?: ResponsiveTypeWithNone<Space>;
  paddingVertical?: ResponsiveTypeWithNone<Space>;
  paddingTop?: ResponsiveTypeWithNone<Space>;
  paddingBottom?: ResponsiveTypeWithNone<Space>;
  paddingLeft?: ResponsiveTypeWithNone<Space>;
  paddingRight?: ResponsiveTypeWithNone<Space>;
  borderRadius?: ResponsiveTypeWithNone<Space>;
  shadow?: ResponsiveTypeWithNone<Shadow>;
  justifyContent?: ResponsiveType<JustifyContent>;
  alignContent?: ResponsiveType<AlignContent>;
  alignItems?: ResponsiveType<AlignItems>;
  alignSelf?: ResponsiveType<AlignSelf>;
  flexWrap?: ResponsiveType<FlexWrap>;
  flexDirection?: ResponsiveType<FlexDirection>;
  flexGrow?: ResponsiveType<FlexValue>;
  flexShrink?: ResponsiveType<FlexValue>;
};

export type TextResponsiveStylesObject = ResponsiveStylesObject & {
  textAlign?: ResponsiveType<TextAlign>;
};
