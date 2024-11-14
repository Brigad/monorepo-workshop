import { type CSSProperties } from "react";
import { match } from "ts-pattern";

import type { ViewStyle } from "react-native";
import { getScreenWidth } from "@my-monorepo/shared/utils/getScreenWidth";

export type Spacing = "small" | "medium" | "large";

type BackgroundColor =
  | "light"
  | "dark"
  | "error"
  | "success"
  | "warning"
  | "white";

type ResponsiveType<T> = T | [T | "none", T | "none", T | "none"];

export type ResponsiveTypes<T> = {
  [key in keyof T]: ResponsiveType<T[key]>;
};

export type FlexProps = {
  flexDirection?: "row" | "column";
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  alignContent?: "flex-start" | "center" | "flex-end" | "stretch";
  alignSelf?: "auto" | "flex-start" | "center" | "flex-end" | "stretch";
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number;
  flexWrap?: "wrap" | "nowrap" | "wrap-reverse";
  gap?: Spacing;
  rowGap?: Spacing;
  columnGap?: Spacing;
  margin?: Spacing;
  marginHorizontal?: Spacing;
  marginVertical?: Spacing;
  marginTop?: Spacing;
  marginBottom?: Spacing;
  marginLeft?: Spacing;
  marginRight?: Spacing;
  padding?: Spacing;
  paddingHorizontal?: Spacing;
  paddingVertical?: Spacing;
  paddingTop?: Spacing;
  paddingBottom?: Spacing;
  paddingLeft?: Spacing;
  paddingRight?: Spacing;
  borderRadius?: Spacing;
  shadow?: "low" | "medium" | "high";
  backgroundColor?: BackgroundColor;
};

export type ResponsiveFlexProps = ResponsiveTypes<FlexProps>;

const screenWidth = getScreenWidth();
const index = match(screenWidth)
  .when((width) => width >= 1280, () => 2)
  .when((width) => width >= 768, () => 1)
  .otherwise(() => 0);

export const getBackgroundColor = (color: ResponsiveType<BackgroundColor>) => {
  return match({ color: Array.isArray(color) ? color[index] : color })
    .with({ color: "light" }, () => "#fafafa")
    .with({ color: "dark" }, () => "#121212")
    .with({ color: "error" }, () => "#FF5252")
    .with({ color: "success" }, () => "#4CAF50")
    .with({ color: "warning" }, () => "#FF9800")
    .with({ color: "white" }, () => "#fff")
    .with({ color: "none" }, () => undefined)
    .exhaustive();
};

export const getSpacingValue = (spacing: ResponsiveType<Spacing>) => {
  return match(Array.isArray(spacing) ? spacing[index] : spacing)
    .with("small", () => 4)
    .with("medium", () => 8)
    .with("large", () => 16)
    .with("none", () => 0)
    .exhaustive();
};

const getShadowValue = (
  shadow: ResponsiveType<"low" | "medium" | "high">,
  platform: "web" | "android" | "ios"
) => {
  return match({ shadow: Array.isArray(shadow) ? shadow[index] : shadow, platform })
    .with({ shadow: "low", platform: "web" }, () => ({
      boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.18)",
    }))
    .with({ shadow: "medium", platform: "web" }, () => ({
      boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.22)",
    }))
    .with({ shadow: "high", platform: "web" }, () => ({
      boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.25)",
    }))
    .with({ shadow: "low", platform: "ios" }, () => ({
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
    }))
    .with({ shadow: "medium", platform: "ios" }, () => ({
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    }))
    .with({ shadow: "high", platform: "ios" }, () => ({
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    }))
    .with({ shadow: "low", platform: "android" }, () => ({
      elevation: 1,
    }))
    .with({ shadow: "medium", platform: "android" }, () => ({
      elevation: 2,
    }))
    .with({ shadow: "high", platform: "android" }, () => ({
      elevation: 4,
    }))
    .with({ shadow: "none" }, () => ({}))
    .exhaustive();
};

export const getStyleFromProps = (
  props: ResponsiveFlexProps,
  platform: "web" | "android" | "ios"
) => {
  return Object.entries(props).reduce<CSSProperties & ViewStyle>(
    (acc, [key, value]) => {
      return {
        ...acc,
        ...match(key)
          .with(
            "margin",
            "marginHorizontal",
            "marginVertical",
            "marginTop",
            "marginBottom",
            "marginLeft",
            "marginRight",
            "padding",
            "paddingHorizontal",
            "paddingVertical",
            "paddingTop",
            "paddingBottom",
            "paddingLeft",
            "paddingRight",
            "rowGap",
            "columnGap",
            "gap",
            "borderRadius",
            (key) => {
              return {
                [key]: getSpacingValue(value as ResponsiveType<Spacing>),
              };
            }
          )
          .with("shadow", () => {
            return getShadowValue(
              value as ResponsiveType<"low" | "medium" | "high">,
              platform
            );
          })
          .with("backgroundColor", () => {
            return {
              backgroundColor: getBackgroundColor(
                value as ResponsiveType<
                  "light" | "dark" | "error" | "success" | "warning" | "white"
                >
              ),
            };
          })
          .otherwise((key) => ({
            [key]: value,
          })),
      };
    },
    {}
  );
};
