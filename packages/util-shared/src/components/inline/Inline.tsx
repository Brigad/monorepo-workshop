import { Flex } from "@my-monorepo/shared/components/flex/Flex";
import {
  ResponsiveTypes,
  Spacing,
} from "@my-monorepo/shared/components/flex/Flex.common";
import { FunctionComponent, ReactNode } from "react";

export type HorizontalAlign =
  | "left"
  | "center"
  | "right"
  | "space-between"
  | "space-around";

export type VerticalAlign = "stretch" | "top" | "center" | "bottom";

const verticalAlignToAlignItems = {
  stretch: "stretch",
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
  none: "none",
} as const;

const horizontalAlignToJustifyContent = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
  "space-between": "space-between",
  "space-around": "space-around",
  none: "none",
} as const;

type InlineProps = ResponsiveTypes<{
  space?: Spacing;
  horizontalAlign?: HorizontalAlign;
  verticalAlign?: VerticalAlign;
  flexGrow?: number;
  flexShrink?: number;
  wrap?: boolean;
}>;

const Inline: FunctionComponent<InlineProps & { children: ReactNode }> = ({
  children,
  space,
  horizontalAlign,
  verticalAlign,
  flexGrow,
  flexShrink,
  wrap,
}) => {
  return (
    <Flex
      flexDirection="row"
      gap={space}
      flexGrow={flexGrow}
      flexShrink={flexShrink}
      alignItems={
        Array.isArray(verticalAlign)
          ? [
              verticalAlignToAlignItems[verticalAlign[0]],
              verticalAlignToAlignItems[verticalAlign[1]],
              verticalAlignToAlignItems[verticalAlign[2]],
            ]
          : verticalAlignToAlignItems[verticalAlign]
      }
      justifyContent={
        Array.isArray(horizontalAlign)
          ? [
              horizontalAlignToJustifyContent[horizontalAlign[0]],
              horizontalAlignToJustifyContent[horizontalAlign[1]],
              horizontalAlignToJustifyContent[horizontalAlign[2]],
            ]
          : horizontalAlignToJustifyContent[horizontalAlign]
      }
      flexWrap={wrap ? "wrap" : "nowrap"}
    >
      {children}
    </Flex>
  );
};

export { Inline };
