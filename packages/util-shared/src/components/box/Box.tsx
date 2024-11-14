import { Flex } from "@my-monorepo/shared/components/flex/Flex";
import { FlexProps, ResponsiveTypes } from "@my-monorepo/shared/components/flex/Flex.common";
import { FunctionComponent, ReactNode } from "react";

type BoxProps = ResponsiveTypes<Pick<
  FlexProps,
  | "flexGrow"
  | "flexShrink"
  | "margin"
  | "marginHorizontal"
  | "marginVertical"
  | "padding"
  | "paddingHorizontal"
  | "paddingVertical"
  | "borderRadius"
  | "backgroundColor"
  | "shadow"
>>;

const Box: FunctionComponent<BoxProps & { children: ReactNode }> = ({
  children,
  ...props
}) => {
  return <Flex {...props}>{children}</Flex>;
};

export { Box };
