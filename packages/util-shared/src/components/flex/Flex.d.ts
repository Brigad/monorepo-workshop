declare module "@my-monorepo/shared/components/flex/Flex" {
  import { ComponentProps, FunctionComponent } from "react";

  import { Flex as FlexNative } from "@my-monorepo/shared/components/flex/Flex.native";
  import { Flex as FlexWeb } from "@my-monorepo/shared/components/flex/Flex.web";

  type Flex = FunctionComponent<
    ComponentProps<typeof FlexWeb> & ComponentProps<typeof FlexNative>
  >;

  const Flex: Flex;

  export { Flex };
}
