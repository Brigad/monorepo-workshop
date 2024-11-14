import { Flex } from "@my-monorepo/shared/components/flex/Flex";
import {
  ResponsiveTypes,
  Spacing,
} from "@my-monorepo/shared/components/flex/Flex.common";
import { FunctionComponent, ReactNode } from "react";

export type HorizontalAlign = "stretch" | "left" | "center" | "right";

export type VerticalAlign =
  | "top"
  | "center"
  | "bottom"
  | "space-between"
  | "space-around";

const horizontalAlignToAlignItemMap = {
  left: "flex-start",
  right: "flex-end",
  center: "center",
  stretch: "stretch",
} as const;

const verticalAlignToAlignContentMap = {
  top: "flex-start",
  bottom: "flex-end",
  center: "center",
  "space-between": "space-between",
  "space-around": "space-around",
} as const;

type StackProps = ResponsiveTypes<{
  space?: Spacing;
  horizontalAlign?: HorizontalAlign;
  verticalAlign?: VerticalAlign;
  flexGrow?: number;
  flexShrink?: number;
}>;

const Stack: FunctionComponent<StackProps & { children: ReactNode }> = ({
  children,
  space,
  horizontalAlign,
  verticalAlign,
  flexGrow,
  flexShrink,
}) => {
  return (
    <Flex
      flexDirection="column"
      gap={space}
      flexGrow={flexGrow}
      flexShrink={flexShrink}
      alignItems={
        Array.isArray(horizontalAlign)
          ? [
              horizontalAlignToAlignItemMap[horizontalAlign[0]],
              horizontalAlignToAlignItemMap[horizontalAlign[1]],
              horizontalAlignToAlignItemMap[horizontalAlign[2]],
            ]
          : horizontalAlignToAlignItemMap[horizontalAlign]
      }
      justifyContent={
        Array.isArray(verticalAlign)
          ? [
              verticalAlignToAlignContentMap[verticalAlign[0]],
              verticalAlignToAlignContentMap[verticalAlign[1]],
              verticalAlignToAlignContentMap[verticalAlign[2]],
            ]
          : verticalAlignToAlignContentMap[verticalAlign]
      }
    >
      {children}
    </Flex>
  );
};

export { Stack };
