import { View } from "react-native";
import React from "react";
import { BoxProps, getBackgroundColor, getValueFromConstantSpacing } from "./utils";

const Box = ({ margin, padding, backgroundColor, borderRadius, children }: BoxProps) => {
  return (
    <View
      style={{
        margin: getValueFromConstantSpacing(margin),
        padding: getValueFromConstantSpacing(padding),
        backgroundColor: getBackgroundColor(backgroundColor),
        borderRadius: getValueFromConstantSpacing(borderRadius),
      }}
    >
      {children}
    </View>
  );
};

export {Box};
