import React from "react";
import { BoxProps, getBackgroundColor, getValueFromConstantSpacing } from "./utils";
import { Flex } from "../Flex/Flex.web";

const Box = ({ margin, padding, backgroundColor, borderRadius, children }: BoxProps) => {
  return (
    <Flex
      className={className}
      f
    >
      {children}
    </Flex>
  );
};

export {Box};
