import { View } from "react-native";
import { FlexProps } from "./utils";
import React from "react";
import { getStyles } from "../../utils/responsive-styles/ResponsiveStyles.native";

export const Flex = ({
  children,
  alignContent,
  alignItems,
  justifyContent,
  alignSelf,
  flexDirection,
  wrap,
  flexGrow,
  flexShrink,
}: FlexProps) => {
  const style = getStyles({
    alignContent,
    alignItems,
    justifyContent,
    alignSelf,
    flexDirection,
    flexWrap: wrap,
    flexGrow,
    flexShrink,
  });

  return <View style={style}>{children}</View>;
};
