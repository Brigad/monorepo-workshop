# monorepo-workshop

## Setup a monorepo with mixed projects

We want to create a monorepo with a web project and a native project.

I will use vite, expo and yarn but feel free to use what you want.

For expo, please follow the following instructions to make it compatible with monorepos: https://docs.expo.dev/guides/monorepos/

<details>
  <summary><strong>General setup</strong></summary>

  ```sh
  mkdir packages
  cd packages

  npm create vite@latest
  npx create-expo-app@latest --template blank-typescript
  ```

  Let's set up a monorepo with yarn:

  ```sh
  yarn init
  yarn set version stable
  yarn install
  ```

  Let's set the node linker to node-modules in the `.yarnrc.yml` file:

  ```yml
  nodeLinker: node-modules
  ```

  Let's add the two projects as workspaces in the `package.json` file:

  ```json
  "workspaces": [
    "packages/*"
  ]
  ```
</details>
<details>
  <summary><strong>Expo configuration</strong></summary>

  Create a `metro.config.js` file in the `packages/my-native-app` folder

  Create an `index.js` file in the `packages/my-native-app` folder

  Update `package.json` to use the `index.js` file as entry point
</details>

## 1 - Sharing some common logic

<br/>
<strong>Let's create a util-package that will be accessible within the respective projects</strong>

<details>
  <summary>Answer</summary>

  ```sh
  mkdir packages/util-shared
  cd packages/util-shared
  yarn init
  ```
  Make sure to set the name to `@my-monorepo/util-shared` and the version to `1.0.0`

  Add the shared package as a dependency to the web & native projects

  ```json
  "dependencies": {
    "@my-monorepo/util-shared": "1.0.0"
  }
  ```
</details>

<br/>
<strong>Let's add a simple function in the `src/utils/sayHelloWorld.ts` file:</strong>

<details>
  <summary>Answer</summary>

  In the `packages/util-shared/src/utils/sayHelloWorld.ts` file:

  ```ts
  export function sayHelloWorld() {
    console.log("Hello World");
  }
  ```
</details>

<br/>
<strong>Let's import and use the `sayHelloWorld` function in the `my-web-app` and the `my-native-app` projects</strong>

<details>
  <summary>Answer</summary>

  In the `packages/my-web-app/src/App.tsx` && `packages/my-native-app/App.tsx` files:

  ```tsx
  import { sayHelloWorld } from "@my-monorepo/util-shared/utils/sayHelloWorld";

  sayHelloWorld();
  ```
</details>

<br/>
<strong>Let's address the import issue by adding the tsconfig paths. Vite needs a plugin to process it</strong>

<details>
  <summary>Answer</summary>
  In the `packages/my-web-app` folder:

  ```sh
  yarn add -D vite-tsconfig-paths
  ```

  In the `packages/my-web-app/vite.config.ts` file:

  ```ts
  import tsconfigPaths from 'vite-tsconfig-paths';

  export default defineConfig({ plugins: [react(), tsconfigPaths()] });
  ```

  In the `packages/my-web-app/tsconfig.app.json` and the `packages/my-native-app/tsconfig.json` files:

  ```json
  "paths": {
    "@my-monorepo/util-shared/*": ["../util-shared/src/*"]
  }
  ```
</details>

<br/>
<strong>Let's make a hook that uses the `sayHelloWorld` function:</strong>

<details>
  <summary>Answer</summary>

  In the `packages/util-shared/src/hooks/useSayHelloWorld.ts` file:

  ```tsx
  import { useEffect } from "react";
  import { sayHelloWorld } from "@my-monorepo/util-shared";

  export function useSayHelloWorld() {
    useEffect(() => {
      sayHelloWorld();
    }, []);
  }
  ```
</details>

<br/>
<strong>What if we were to use a different version of react in shared than in the native project ?</strong>

<details>
  <summary>Answer</summary>

  Let's add react 18.3.1 as a dependency in the `packages/util-shared/package.json` file:

  ```json
  "dependencies": {
    "react": "18.3.1"
  }
  ```
</details>

<br/>
<strong>Let's now use the `useSayHelloWorld` hook in the `my-native-app` project</strong>

<details>
  <summary>Answer</summary>

  In the `packages/my-native-app/App.tsx` file:

  ```tsx
  import { useSayHelloWorld } from "@my-monorepo/util-shared/hooks/useSayHelloWorld";

  useSayHelloWorld();
  ```
</details>

<br/>
<strong>How to ensure unicity for some dependencies ?</strong>

<details>
  <summary>Answer</summary>

  There are multiple ways to do that:
  - Forcing the version of a package across the monorepo
  - Forcing the resolution of a dependency to a specific version per project within the bundling process

  To allow more flexibility, we will use the second approach.
  To do that, we can:
  - use babel with babel-plugin-module-resolver
  - use metro with the disableHierarchicalLookup option (this is a bit extreme as it applies to all dependencies)
  - use a custom resolver with metro for selected dependencies

  For this example, we will use the custom resolver with metro for selected dependencies.

  In the `packages/my-native-app/metro.config.js` file:

  ```js
  const path = require("path");

  const librariesToDedupe = [
    "react-native",
    "react",
    "react-native-safe-area-context",
    "react-native-svg",
  ];
  const regexes = librariesToDedupe.map((lib) => new RegExp(`^${lib}(/.*)?$`));

  const resolvePathFromProjectRoot = (filePath) => {
    return {
      type: "sourceFile",
      filePath: require.resolve(filePath, {
        paths: [projectRoot],
      }),
    };
  };

  config.resolver.resolveRequest = (context, moduleName, platform) => {
    const results = regexes.find((regex) => regex.test(moduleName))?.exec(moduleName);
    if (results?.[1]) {
      try {
        return resolvePathFromProjectRoot(`${moduleName}.${platform}`);
      } catch (err) {
        // Ignore err
      }
      if (platform === "ios" || platform === "android") {
        try {
          return resolvePathFromProjectRoot(`${moduleName}.native`);
        } catch (err) {
          // Ignore err
        }
      } else if (platform === "web") {
        try {
          return resolvePathFromProjectRoot(`${moduleName}.web`);
        } catch (err) {
          // Ignore err
        }
      }
    }
    if (results) {
      return resolvePathFromProjectRoot(moduleName);
    }

    return context.resolveRequest(context, moduleName, platform);
  };
  ```
</details>

## 2 - Sharing some platform specific logic

<br/>
We now will add some platform specific logic to the shared package.Sometime, each platform will need some dedicated logic.

Work is ongoing to make it easier to share code between web & native, with react-strict-dom and @react-native-webapis.

For now, we will do it manually.

<br/>
<br/>
<strong>Let's create a function that return the screen width</strong>

<details>
  <summary>Answer</summary>

  In the `packages/util-shared/src/utils/getScreenWidth.web.ts` file:

  ```ts
  export function getScreenWidth() {
    return window.screen.width;
  }
  ```

  In the `packages/util-shared/src/utils/getScreenWidth.native.ts` file:

  ```ts
  import { Dimensions } from "react-native";

  export function getScreenWidth() {
    return Dimensions.get("window").width;
  }
  ```
</details>

<br/>
We need to make sure that the web project can import files with the `.web.ts` extension.

We do not want to specify the platform in the import statement.
<br/>
<br/>
<strong>Let's import the `getScreenWidth` function in the `my-web-app` and the `my-native-app` projects</strong>

<details>
  <summary>Answer</summary>
  In the `packages/my-web-app/tsconfig.json` and the `packages/my-native-app/tsconfig.json` files:

  ```json
  "moduleSuffixes": [".web", ""],
  ```
  OR
  ```json
  "moduleSuffixes": [".ios", ".android", ".native", ""],
  ```
  In the `packages/my-web-app/vite.config.ts` file:

  ```ts
  resolve: {
    extensions: [
      ".web.ts",
      ".web.tsx",
      ".web.js",
      ".web.jsx",
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".json",
      ".mjs",
      ".cjs",
    ],
  },
  ```

  In the `packages/my-web-app/src/App.tsx` and the `packages/my-native-app/App.tsx` files:

  ```tsx
  import { getScreenWidth } from "@my-monorepo/util-shared/utils/getScreenWidth";

  console.log(getScreenWidth());
  ```
</details>

## 3 - Creating the first bricks of our design system

We want to create a component that will be used in place of `<div>` or `<View>`.

We will use flexbox as it is the common layout system for both web & native.

Let's name that component `<Flex>`. We will share as much logic as possible, we can create `flex.common.ts` for the shared logic and `flex.(native|web).tsx` for the platform specific logic. Let's use the style prop on both platform for now to simplify the step.

```tsx
type Spacing = "small" | "medium" | "large";

type FlexProps = {
  flexDirection?: "row" | "column";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  alignContent?: "flex-start" | "center" | "flex-end" | "stretch";
  alignSelf?: "auto" | "flex-start" | "center" | "flex-end" | "stretch";
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number;
  flexWrap?: "wrap" | "nowrap" | "wrap-reverse";
  gap?: Spacing;
  rowGap?: Spacing;
  columnGap?: Spacing;
  margin?: Spacing;
  marginHorizontal?: Spacing;
  marginVertical?: Spacing;
  marginTop?: Spacing;
  marginBottom?: Spacing;
  marginLeft?: Spacing;
  marginRight?: Spacing;
  padding?: Spacing;
  paddingHorizontal?: Spacing;
  paddingVertical?: Spacing;
  paddingTop?: Spacing;
  paddingBottom?: Spacing;
  paddingLeft?: Spacing;
  paddingRight?: Spacing;
  borderRadius?: Spacing;
  shadow?: "low" | "medium" | "high";
  backgroundColor?: "light" | "dark" | "error" | "success" | "warning" | "white";
}
```

<br/>
<br/>
<strong>Let's create the `Flex` component</strong>

<details>
  <summary>Answer</summary>

  In the `packages/util-shared/src/components/Flex.native.tsx` file:

  ```tsx
  import { View, Platform, ViewStyle } from "react-native";
  import { FlexProps, getBackgroundColor, getSpacingValue, Spacing } from "./Flex.common";
  import React from "react";
  import { match } from "ts-pattern";

  const getShadowValue = (shadow: "low" | "medium" | "high") => {
    return match({ shadow, platform: Platform.OS })
      .with({ shadow: "low", platform: "ios" }, () => ({
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
      }))
      .with({ shadow: "medium", platform: "ios" }, () => ({
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      }))
      .with({ shadow: "high", platform: "ios" }, () => ({
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }))
      .with({ shadow: "low", platform: "android" }, () => ({
        elevation: 1,
      }))
      .with({ shadow: "medium", platform: "android" }, () => ({
        elevation: 2,
      }))
      .with({ shadow: "high", platform: "android" }, () => ({
        elevation: 4,
      }))
      .otherwise(() => ({}));
  };

  const getStyleFromProps = (props: FlexProps) => {
    return Object.entries(props).reduce<ViewStyle>((acc, [key, value]) => {
      return {
        ...acc,
        ...match(key)
          .with(
            "margin",
            "marginHorizontal",
            "marginVertical",
            "marginTop",
            "marginBottom",
            "marginLeft",
            "marginRight",
            "padding",
            "paddingHorizontal",
            "paddingVertical",
            "paddingTop",
            "paddingBottom",
            "paddingLeft",
            "paddingRight",
            "rowGap",
            "columnGap",
            "gap",
            "borderRadius",
            (key) => {
              return {
                [key]: getSpacingValue(value as Spacing),
              };
            }
          )
          .with("shadow", () => {
            return getShadowValue(value as "low" | "medium" | "high");
          })
          .with("backgroundColor", () => {
            return {
              backgroundColor: getBackgroundColor(
                value as "light" | "dark" | "error" | "success" | "warning" | "white"
              ),
            };
          })
          .otherwise((key) => ({
            [key]: value,
          })),
      };
    }, {});
  };

  const defaultStyles = {
    flexDirection: "column",
    alignContent: "stretch",
    flexShrink: 1,
  } as const;

  export const Flex = ({
    children,
    ...props
  }: FlexProps & { children?: React.ReactNode }) => {
    const style = {
      ...defaultStyles,
      ...getStyleFromProps(props),
    };
    return <View style={style}>{children}</View>;
  };
  ```

  In the `packages/util-shared/src/components/Flex.web.tsx` file:

  ```tsx
  import { FlexProps, getBackgroundColor, getSpacingValue, Spacing } from "./Flex.common";
  import React, { CSSProperties } from "react";
  import { match } from "ts-pattern";

  const getShadowValue = (shadow: "low" | "medium" | "high") => {
    return match({ shadow })
      .with({ shadow: "low" }, () => ({
        boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.18)",
      }))
      .with({ shadow: "medium" }, () => ({
        boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.22)",
      }))
      .with({ shadow: "high" }, () => ({
        boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.25)",
      }))
      .otherwise(() => ({}));
  };

  const getStyleFromProps = (props: FlexProps) => {
    return Object.entries(props).reduce<CSSProperties>((acc, [key, value]) => {
      return {
        ...acc,
        ...match(key)
          .with(
            "margin",
            "marginHorizontal",
            "marginVertical",
            "marginTop",
            "marginBottom",
            "marginLeft",
            "marginRight",
            "padding",
            "paddingHorizontal",
            "paddingVertical",
            "paddingTop",
            "paddingBottom",
            "paddingLeft",
            "paddingRight",
            "rowGap",
            "columnGap",
            "gap",
            "borderRadius",
            (key) => {
              return {
                [key]: getSpacingValue(value as Spacing),
              };
            }
          )
          .with("shadow", () => {
            return getShadowValue(value as "low" | "medium" | "high");
          })
          .with("backgroundColor", () => {
            return {
              backgroundColor: getBackgroundColor(
                value as "light" | "dark" | "error" | "success" | "warning" | "white"
              ),
            };
          })
          .otherwise((key) => ({
            [key]: value,
          })),
      };
    }, {});
  };

  const defaultStyles = {
    flexDirection: "column",
    alignContent: "stretch",
    flexShrink: 1,
    display: "flex",
  } as const;

  export const Flex = ({
    children,
    ...props
  }: FlexProps & { children?: React.ReactNode }) => {
    const style = {
      ...defaultStyles,
      ...getStyleFromProps(props),
    };
    return <div style={style}>{children}</div>;
  };
  ```
</details>

## 4 - React Strict Dom ? React Native web ?

How what we build works with the past and future of web sharing technologies