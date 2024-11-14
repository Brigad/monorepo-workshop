import { Text as RNText } from "react-native";
import { TextProps, getStyleFromProps } from "./Text.common";
import React from "react";
import { match } from "ts-pattern";

const getLineHeight = (type: TextProps["type"]) => {
  return match(type)
    .with("title", () => ({ lineHeight: 32 }))
    .with("subtitle", () => ({ lineHeight: 24 }))
    .with("body", () => ({ lineHeight: 20 }))
    .with("caption", () => ({ lineHeight: 16 }))
    .exhaustive();
};

export const Text = ({ children, color, type, bold }: TextProps & { children?: React.ReactNode }) => {
  const style = {
    ...getStyleFromProps({ color, type, bold }),
    ...getLineHeight(type),
  };
  return <RNText style={style}>{children}</RNText>;
};