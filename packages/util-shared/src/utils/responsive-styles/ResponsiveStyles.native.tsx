import { Platform, StyleProp, TextStyle, ViewStyle } from "react-native";
import {
  AlignContent,
  AlignItems,
  FlexDirection,
  FlexValue,
  FlexWrap,
  JustifyContent,
  ResponsiveStyles,
  ResponsiveStylesObject,
  ResponsiveTypeWithNone,
  Shadow,
  Space,
  TextAlign,
  TextResponsiveStylesObject,
} from "./types";

export const getStyleFromResponsiveStyle = <T extends ResponsiveStyles>(
  style: ResponsiveTypeWithNone<T>
) => {
  const newStyle = Array.isArray(style) ? style[0] : style;

  if (newStyle === "none") {
    return undefined;
  }

  return newStyle;
};

const spaces = {
  small: 4,
  medium: 8,
  large: 16,
};

const getSpaceFromResponsiveStyle = (
  spaceStyle: ResponsiveTypeWithNone<Space> | undefined
) => {
  if (!spaceStyle) {
    return undefined;
  }
  const style = getStyleFromResponsiveStyle(spaceStyle);
  return style ? spaces[style] : undefined;
};

const shadows =
  Platform.OS === "ios"
    ? {
        "shadow-elevation-high": {
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        "shadow-elevation-normal": {
          shadowColor: "black",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
        },
        "shadow-elevation-low": {
          shadowColor: "black",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.18,
          shadowRadius: 1.0,
        } ,
      }
    : {
        "shadow-elevation-high": {
          elevation: 4,
        },
        "shadow-elevation-normal": {
          elevation: 2,
        },
        "shadow-elevation-low": {
          elevation: 1,
        },
    };

const getShadowFromResponsiveStyle = (
  shadowStyle: ResponsiveTypeWithNone<Shadow> | undefined
) => {
  if (!shadowStyle) {
    return undefined;
  }
  const style = getStyleFromResponsiveStyle(shadowStyle);
  return style ? shadows[style] : undefined;
};

const getFlexValueFromResponsiveStyle = (
  flexValueStyle: ResponsiveTypeWithNone<FlexValue> | undefined
) => {
  if (!flexValueStyle) {
    return undefined;
  }
  const style = getStyleFromResponsiveStyle(flexValueStyle);
  return style ?? undefined;
};

const getTextAlignFromResponsiveStyle = (
  textAlignStyle: ResponsiveTypeWithNone<TextAlign> | undefined
) => {
  if (!textAlignStyle) {
    return undefined;
  }
  const style = getStyleFromResponsiveStyle(textAlignStyle);
  return style ?? undefined;
};

const getJustifyContentFromResponsiveStyle = (
  justifyContentStyle: ResponsiveTypeWithNone<JustifyContent> | undefined
) => {
  if (!justifyContentStyle) {
    return undefined;
  }
  const style = getStyleFromResponsiveStyle(justifyContentStyle);
  return style ?? undefined;
};

const getAlignContentFromResponsiveStyle = (
  alignContentStyle: ResponsiveTypeWithNone<AlignContent> | undefined
) => {
  if (!alignContentStyle) {
    return undefined;
  }
  const style = getStyleFromResponsiveStyle(alignContentStyle);
  return style ?? undefined;
};

const getAlignItemsFromResponsiveStyle = (
  alignItemsStyle: ResponsiveTypeWithNone<AlignItems> | undefined
) => {
  if (!alignItemsStyle) {
    return undefined;
  }
  const style = getStyleFromResponsiveStyle(alignItemsStyle);
  return style ?? undefined;
};

const getAlignSelfFromResponsiveStyle = getAlignItemsFromResponsiveStyle;

const getFlexWrapFromResponsiveStyle = (
  flexWrapStyle: ResponsiveTypeWithNone<FlexWrap> | undefined
) => {
  if (!flexWrapStyle) {
    return undefined;
  }
  const style = getStyleFromResponsiveStyle(flexWrapStyle);
  return style ?? undefined;
};

const getFlexDirectionFromResponsiveStyle = (
  flexDirectionStyle: ResponsiveTypeWithNone<FlexDirection> | undefined
) => {
  if (!flexDirectionStyle) {
    return undefined;
  }
  const style = getStyleFromResponsiveStyle(flexDirectionStyle);
  return style ?? undefined;
};

const getStyles = ({
  gap,
  rowGap,
  columnGap,
  margin,
  marginHorizontal,
  marginVertical,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  padding,
  paddingHorizontal,
  paddingVertical,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  borderRadius,
  shadow,
  justifyContent,
  alignContent,
  alignItems,
  alignSelf,
  flexWrap,
  flexDirection,
  flexGrow,
  flexShrink,
  textAlign,
}: Partial<ResponsiveStylesObject & TextResponsiveStylesObject>) => {
  return {
    gap: getSpaceFromResponsiveStyle(gap),
    rowGap: getSpaceFromResponsiveStyle(rowGap),
    columnGap: getSpaceFromResponsiveStyle(columnGap),
    margin: getSpaceFromResponsiveStyle(margin),
    marginHorizontal: getSpaceFromResponsiveStyle(marginHorizontal),
    marginVertical: getSpaceFromResponsiveStyle(marginVertical),
    marginTop: getSpaceFromResponsiveStyle(marginTop),
    marginBottom: getSpaceFromResponsiveStyle(marginBottom),
    marginLeft: getSpaceFromResponsiveStyle(marginLeft),
    marginRight: getSpaceFromResponsiveStyle(marginRight),
    padding: getSpaceFromResponsiveStyle(padding),
    paddingHorizontal: getSpaceFromResponsiveStyle(paddingHorizontal),
    paddingVertical: getSpaceFromResponsiveStyle(paddingVertical),
    paddingTop: getSpaceFromResponsiveStyle(paddingTop),
    paddingBottom: getSpaceFromResponsiveStyle(paddingBottom),
    paddingLeft: getSpaceFromResponsiveStyle(paddingLeft),
    paddingRight: getSpaceFromResponsiveStyle(paddingRight),
    borderRadius: getSpaceFromResponsiveStyle(borderRadius),
    flexGrow: getFlexValueFromResponsiveStyle(flexGrow),
    flexShrink: getFlexValueFromResponsiveStyle(flexShrink),
    textAlign: getTextAlignFromResponsiveStyle(textAlign),
    justifyContent: getJustifyContentFromResponsiveStyle(justifyContent),
    alignContent: getAlignContentFromResponsiveStyle(alignContent),
    alignItems: getAlignItemsFromResponsiveStyle(alignItems),
    alignSelf: getAlignSelfFromResponsiveStyle(alignSelf),
    flexWrap: getFlexWrapFromResponsiveStyle(flexWrap),
    flexDirection: getFlexDirectionFromResponsiveStyle(flexDirection),
    ...getShadowFromResponsiveStyle(shadow),
  } satisfies StyleProp<ViewStyle> & StyleProp<TextStyle>;
};

export { getStyles };
