import { View, Platform } from "react-native";
import { getStyleFromProps, ResponsiveFlexProps } from "./Flex.common";
import React from "react";

const defaultStyles = {
  flexDirection: "column",
  alignContent: "stretch",
  flexShrink: 1,
} as const;

export const Flex = ({
  children,
  ...props
}: ResponsiveFlexProps & { children?: React.ReactNode }) => {
  const style = {
    ...defaultStyles,
    ...getStyleFromProps(props, Platform.OS as "android" | "ios"),
  };
  return <View style={style}>{children}</View>;
};