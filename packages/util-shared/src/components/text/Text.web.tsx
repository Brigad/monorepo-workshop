import { match } from "ts-pattern";
import { TextProps, getStyleFromProps } from "./Text.common";
import React from "react";

const defaultStyles = {
  display: "inline",
} as const;

const getLineHeight = (type: TextProps["type"]) => {
  return match(type)
    .with("title", () => ({ lineHeight: "32px" }))
    .with("subtitle", () => ({ lineHeight: "24px" }))
    .with("body", () => ({ lineHeight: "20px" }))
    .with("caption", () => ({ lineHeight: "16px" }))
    .exhaustive();
};

export const Text = ({
  children,
  color,
  type,
  bold,
}: TextProps & { children?: React.ReactNode }) => {
  const style = {
    ...defaultStyles,
    ...getLineHeight(type),
    ...getStyleFromProps({ color, type, bold }),
  };
  return <div style={style}>{children}</div>;
};
