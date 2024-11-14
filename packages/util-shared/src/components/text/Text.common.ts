import { match } from "ts-pattern";
import type { TextStyle } from "react-native";
import type { CSSProperties } from "react";

export type TextProps = {
  type: "title" | "body" | "subtitle" | "caption";
  color: "dark" | "light" | "error" | "success" | "warning";
  bold?: boolean;
};

const getColorFromProps = (color: TextProps["color"]) => {
  return match({ color })
    .with({ color: "dark" }, () => "#000")
    .with({ color: "light" }, () => "#fff")
    .with({ color: "error" }, () => "#FF5252")
    .with({ color: "success" }, () => "#4CAF50")
    .with({ color: "warning" }, () => "#FF9800")
    .exhaustive();
};

export const getStyleFromProps = ({
  type,
  bold,
  color,
}: TextProps): TextStyle & CSSProperties => {
  return {
    ...match(type)
      .with("title", () => ({ fontSize: 24 }))
      .with("subtitle", () => ({ fontSize: 18 }))
      .with("body", () => ({ fontSize: 14 }))
      .with("caption", () => ({ fontSize: 12 }))
      .exhaustive(),
    ...(bold ? { fontWeight: "bold" } : {}),
    color: getColorFromProps(color),
    fontFamily: "Georgia",
  };
};
