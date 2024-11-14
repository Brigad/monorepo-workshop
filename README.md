# Building a design system for web & native with a monorepo

By the end of this workshop, you will be able to:
- Setup a monorepo with mixed projects
- Share code between web & native
- Create a design system for web & native

We will create a basic design system with a `Box`, `Stack` and `Inline` component.


## Setup a monorepo with mixed projects

We want to create a monorepo with a web project and a native project.

I will use vite, expo and yarn but feel free to use what you want.

For expo, please follow the following instructions to make it compatible with monorepos: https://docs.expo.dev/guides/monorepos/

<details>
  <summary><strong>General setup</strong></summary>

  ```sh
  mkdir my-monorepo
  cd my-monorepo
  mkdir packages
  cd packages

  npm create vite@latest my-web-app -- --template react-ts
  npx create-expo-app@latest my-native-app --template blank-typescript
  # if you want to run your expo app on web, you can use the following command:
  cd my-native-app
  npx expo install react-dom react-native-web @expo/metro-runtime
  ```

  Let's set up a monorepo with yarn:

  ```sh
  # remove the packages/my-*-app/node_modules folder
  rm -rf packages/my-web-app/node_modules
  rm -rf packages/my-native-app/node_modules
  rm -rf packages/my-web-app/package-lock.json
  rm -rf packages/my-native-app/package-lock.json

  # In the root of the monorepo
  yarn init --yes
  yarn set version stable
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

  Install the dependencies:

  ```sh
  yarn install
  ```
</details>
<details>
  <summary><strong>Expo configuration</strong></summary>

  Create a [metro.config.js](https://docs.expo.dev/guides/monorepos/#modify-the-metro-config) file in the `packages/my-native-app` folder

  Create an [index.js](https://docs.expo.dev/guides/monorepos/#change-default-entrypoint) file in the `packages/my-native-app` folder

  Update `package.json` to use the `index.js` file as entry point
</details>

## 1 - Sharing some common logic

<br/>
<strong>Let's create a `util-shared` package that will be accessible within the respective projects</strong>

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
  // Notice that we did not specify 'src' in the import statement, so it's not working yet
  // We will fix it in the next step

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
  {
    "compilerOptions": {
      "paths": {
        "@my-monorepo/util-shared/*": ["../util-shared/src/*"]
      }
    }
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
  import { sayHelloWorld } from "../utils/sayHelloWorld";

  export function useSayHelloWorld() {
    useEffect(() => {
      sayHelloWorld();
    }, []);
  }
  ```
</details>

<br/>

Sometimes, in a monorepo, multiple versions of the same package can be installed.
It's important to understand how the resolution works, to be able to fix issues that arise from that.


What if we were to use a different version of react in shared than in the native project ?

Let's add react 18.2.0 as a dependency in the `packages/util-shared/package.json` file:

```json
"dependencies": {
  "react": "18.2.0"
}
```

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
We will now add some platform specific logic to the shared package. Sometimes, each platform will need some dedicated logic.

Work is ongoing to make it easier to share code between web & native, with react-strict-dom and @react-native-webapis.

For now, we will do it manually.

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
  In the `packages/my-web-app/tsconfig.app.json` and the `packages/my-native-app/tsconfig.json` files:

  ```json
  "compilerOptions": {
    "moduleSuffixes": [".web", ""],
  }
  ```
  OR
  ```json
  "compilerOptions": {
    "moduleSuffixes": [".ios", ".android", ".native", ""],
  }
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

Let's name that component `<Flex>`. We will share as much logic as possible, we can create `Flex.common.ts` for the shared logic and `Flex.(native|web).tsx` for the platform specific logic. Let's use the style prop on both platform for now to simplify the step.

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
<strong>Let's create the `Flex` component</strong>

<details>
  <summary>Answer</summary>

  In the `packages/util-shared/src/components/Flex.web.tsx` file:

  ```tsx
  import { FlexProps, getStyleFromProps } from "./Flex.common";
  import React from "react";

  const defaultStyles = {
    flexDirection: "column",
    display: "flex",
  } as const;

  export const Flex = ({
    children,
    ...props
  }: FlexProps & { children?: React.ReactNode }) => {
    const style = {
      ...defaultStyles,
      ...getStyleFromProps(props, "web"),
    };
    return <div style={style}>{children}</div>;
  };
  ```

  In the `packages/util-shared/src/components/Flex.native.tsx` file:

  ```tsx
  import { View, Platform } from "react-native";
  import { FlexProps, getStyleFromProps } from "./Flex.common";
  import React from "react";

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
      ...getStyleFromProps(props, Platform.OS as "android" | "ios"),
    };
    return <View style={style}>{children}</View>;
  };
  ```

  And in the `packages/util-shared/src/components/Flex.common.ts` file:

  ```ts
  import { type CSSProperties } from "react";
  import { match } from "ts-pattern";

  import type {ViewStyle} from 'react-native';

  export type Spacing = "small" | "medium" | "large";

  type BackgroundColor = "light" | "dark" | "error" | "success" | "warning" | "white";

  export type FlexProps = {
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
    backgroundColor?: BackgroundColor;
  }

  export const getBackgroundColor = (color: BackgroundColor) => {
    return match({ color })
      .with({ color: "light" }, () => "#fafafa")
      .with({ color: "dark" }, () => "#121212")
      .with({ color: "error" }, () => "#FF5252")
      .with({ color: "success" }, () => "#4CAF50")
      .with({ color: "warning" }, () => "#FF9800")
      .with({ color: "white" }, () => "#fff")
      .exhaustive();
  }

  export const getSpacingValue = (spacing: Spacing) => {
    return match(spacing)
      .with("small", () => 4)
      .with("medium", () => 8)
      .with("large", () => 16)
      .exhaustive();
  };

  const getShadowValue = (shadow: "low" | "medium" | "high", platform: "web" | "android" | "ios") => {
    return match({ shadow, platform })
      .with({ shadow: "low", platform: "web" }, () => ({
        boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.18)",
      }))
      .with({ shadow: "medium", platform: "web" }, () => ({
        boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.22)",
      }))
      .with({ shadow: "high", platform: "web" }, () => ({
        boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.25)",
      }))
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
      .exhaustive();
  };

  export const getStyleFromProps = (props: FlexProps, platform: "web" | "android" | "ios") => {
    return Object.entries(props).reduce<CSSProperties & ViewStyle>((acc, [key, value]) => {
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
            return getShadowValue(value as "low" | "medium" | "high", platform);
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
  ```
</details>

<br/>
We now need something to render text on web and native.

On web, we will use an inline `<div>` and on native, a `<Text>` component. We need to be careful with the line height since setting `lineHeight: 20` has a different meaning on web and native.
On native, 20 means 20px, on web, it means 20 times the fontSize (We need to be explicit and write `lineHeight: "20px"`).

We want our text component props to be:

```ts
type TextProps = {
  type: "title" | "subtitle" | "body" | "caption";
  color: "dark" | "light" | "error" | "success" | "warning";
  bold?: boolean;
};
```

<br/>
<strong>Let's create the `Text` component</strong>

<details>
  <summary>Answer</summary>

  In the `packages/util-shared/src/components/Text.web.tsx` file:

  ```tsx
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
  ```

  In the `packages/util-shared/src/components/Text.native.tsx` file:

  ```tsx
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
  ```

  In the `packages/util-shared/src/components/Text.common.ts` file:

  ```ts
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
  ```
</details>

<br/>

We could now use the `Flex` and `Text` components in the `my-web-app` and the `my-native-app` projects.

```tsx
<Flex
  flexDirection="column"
  shadow="high"
  backgroundColor="white"
  borderRadius="medium"
  padding="medium"
  alignItems="center"
>
  <Text type="title" color="dark">Open up App.tsx</Text>
  <Text type="body" color="dark">to start <Text color="dark" type="body" bold>working</Text> on your app!</Text>
</Flex>
```

It should now look the same on web and native.

Building these foundations for our design system allows us to build abstractions on top of it, and anything that we build can work on both platforms, while each platform can have its own specific implementation, and behave differently if needed.

We could also swap the current implementation of Flex or Text on a specific platform to enable more capabilities, or performances.

Using style props on web is not recommended, let's change that then! We can use any styling system we want on web, let's use tailwind css for this example.

(If you use expo on the web, https://docs.expo.dev/versions/latest/config/metro/#tailwind).

<br/>
<strong>Let's change the `Flex` component to use tailwind css on web</strong>

<details>
  <summary>Answer</summary>

  In the `packages/util-shared/src/components/Flex.web.tsx` file:

  ```tsx
  import { match, P } from "ts-pattern";
  import { FlexProps } from "./Flex.common";
  import React from "react";

  const getAlignItems = (value: FlexProps["alignItems"]) => {
    return match(value)
      .with("flex-start", () => "items-start")
      .with("flex-end", () => "items-end")
      .with("center", () => "items-center")
      .with("stretch", () => "items-stretch")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getAlignContent = (value: FlexProps["alignContent"]) => {
    return match(value)
      .with("flex-start", () => "content-start")
      .with("flex-end", () => "content-end")
      .with("center", () => "content-center")
      .with("stretch", () => "content-stretch")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getAlignSelf = (value: FlexProps["alignSelf"]) => {
    return match(value)
      .with("auto", () => "self-auto")
      .with("flex-start", () => "self-start")
      .with("flex-end", () => "self-end")
      .with("center", () => "self-center")
      .with("stretch", () => "self-stretch")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getJustifyContent = (value: FlexProps["justifyContent"]) => {
    return match(value)
      .with("flex-start", () => "justify-start")
      .with("flex-end", () => "justify-end")
      .with("center", () => "justify-center")
      .with("space-between", () => "justify-between")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getFlexDirection = (value: FlexProps["flexDirection"]) => {
    return match(value)
      .with("row", () => "flex-row")
      .with("column", () => "flex-col")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getGap = (value: FlexProps["gap"]) => {
    return match(value)
      .with("small", () => "gap-1")
      .with("medium", () => "gap-2")
      .with("large", () => "gap-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getRowGap = (value: FlexProps["rowGap"]) => {
    return match(value)
      .with("small", () => "gap-y-1")
      .with("medium", () => "gap-y-2")
      .with("large", () => "gap-y-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getColumnGap = (value: FlexProps["columnGap"]) => {
    return match(value)
      .with("small", () => "gap-x-1")
      .with("medium", () => "gap-x-2")
      .with("large", () => "gap-x-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getFlexWrap = (value: FlexProps["flexWrap"]) => {
    return match(value)
      .with("wrap", () => "flex-wrap")
      .with("wrap-reverse", () => "flex-wrap-reverse")
      .with("nowrap", () => "flex-nowrap")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getFlex = (value: FlexProps["flex"]) => {
    return match(value)
      .with(0, () => "flex-none")
      .with(1, () => "flex-1")
      .with(P.number, () => `flex-[${value}]`)
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getFlexGrow = (value: FlexProps["flexGrow"]) => {
    return match(value)
      .with(0, () => "grow-0")
      .with(1, () => "grow")
      .with(P.number, () => `grow-[${value}]`)
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getFlexShrink = (value: FlexProps["flexShrink"]) => {
    return match(value)
      .with(0, () => "shrink-0")
      .with(1, () => "shrink")
      .with(P.number, () => `shrink-[${value}]`)
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getFlexBasis = (value: FlexProps["flexBasis"]) => {
    return match(value)
      .with(0, () => "basis-0")
      .with(P.number, () => `basis-[${value}px]`)
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getMargin = (value: FlexProps["margin"]) => {
    return match(value)
      .with("small", () => "m-1")
      .with("medium", () => "m-2")
      .with("large", () => "m-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getMarginHorizontal = (value: FlexProps["marginHorizontal"]) => {
    return match(value)
      .with("small", () => "mx-1")
      .with("medium", () => "mx-2")
      .with("large", () => "mx-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getMarginVertical = (value: FlexProps["marginVertical"]) => {
    return match(value)
      .with("small", () => "my-1")
      .with("medium", () => "my-2")
      .with("large", () => "my-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };


  const getMarginLeft = (value: FlexProps["marginLeft"]) => {
    return match(value)
      .with("small", () => "ml-1")
      .with("medium", () => "ml-2")
      .with("large", () => "ml-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getMarginRight = (value: FlexProps["marginRight"]) => {
    return match(value)
      .with("small", () => "mr-1")
      .with("medium", () => "mr-2")
      .with("large", () => "mr-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getMarginTop = (value: FlexProps["marginTop"]) => {
    return match(value)
      .with("small", () => "mt-1")
      .with("medium", () => "mt-2")
      .with("large", () => "mt-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getMarginBottom = (value: FlexProps["marginBottom"]) => {
    return match(value)
      .with("small", () => "mb-1")
      .with("medium", () => "mb-2")
      .with("large", () => "mb-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getPadding = (value: FlexProps["padding"]) => {
    return match(value)
      .with("small", () => "p-1")
      .with("medium", () => "p-2")
      .with("large", () => "p-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getPaddingHorizontal = (value: FlexProps["paddingHorizontal"]) => {
    return match(value)
      .with("small", () => "px-1")
      .with("medium", () => "px-2")
      .with("large", () => "px-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getPaddingVertical = (value: FlexProps["paddingVertical"]) => {
    return match(value)
      .with("small", () => "py-1")
      .with("medium", () => "py-2")
      .with("large", () => "py-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getPaddingLeft = (value: FlexProps["paddingLeft"]) => {
    return match(value)
      .with("small", () => "pl-1")
      .with("medium", () => "pl-2")
      .with("large", () => "pl-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getPaddingRight = (value: FlexProps["paddingRight"]) => {
    return match(value)
      .with("small", () => "pr-1")
      .with("medium", () => "pr-2")
      .with("large", () => "pr-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getPaddingTop = (value: FlexProps["paddingTop"]) => {
    return match(value)
      .with("small", () => "pt-1")
      .with("medium", () => "pt-2")
      .with("large", () => "pt-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getPaddingBottom = (value: FlexProps["paddingBottom"]) => {
    return match(value)
      .with("small", () => "pb-1")
      .with("medium", () => "pb-2")
      .with("large", () => "pb-4")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getBorderRadius = (value: FlexProps["borderRadius"]) => {
    return match(value)
      .with("small", () => "rounded")
      .with("medium", () => "rounded-lg")
      .with("large", () => "rounded-2xl")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getShadow = (value: FlexProps["shadow"]) => {
    return match(value)
      .with("low", () => "shadow")
      .with("medium", () => "shadow-md")
      .with("high", () => "shadow-lg")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getBackgroundColor = (value: FlexProps["backgroundColor"]) => {
    return match(value)
      .with("dark", () => "bg-slate-900")
      .with("light", () => "bg-slate-100")
      .with("white", () => "bg-white")
      .with("error", () => "bg-red-500")
      .with("success", () => "bg-green-500")
      .with("warning", () => "bg-yellow-500")
      .with(undefined, () => undefined)
      .exhaustive();
  };

  const getClassNameFromProps = (props: FlexProps) => {
    return Object.entries(props).reduce<(string | undefined)[]>((acc, [key, value]) => {
      return [
        ...acc,
        match(key as keyof FlexProps)
          .with("alignItems", () => getAlignItems(value as FlexProps["alignItems"]))
          .with("alignContent", () => getAlignContent(value as FlexProps["alignContent"]))
          .with("alignSelf", () => getAlignSelf(value as FlexProps["alignSelf"]))
          .with("justifyContent", () => getJustifyContent(value as FlexProps["justifyContent"]))
          .with("flexDirection", () => getFlexDirection(value as FlexProps["flexDirection"]))
          .with("gap", () => getGap(value as FlexProps["gap"]))
          .with("rowGap", () => getRowGap(value as FlexProps["rowGap"]))
          .with("columnGap", () => getColumnGap(value as FlexProps["columnGap"]))
          .with("flexWrap", () => getFlexWrap(value as FlexProps["flexWrap"]))
          .with("flex", () => getFlex(value as FlexProps["flex"]))
          .with("flexGrow", () => getFlexGrow(value as FlexProps["flexGrow"]))
          .with("flexShrink", () => getFlexShrink(value as FlexProps["flexShrink"]))
          .with("flexBasis", () => getFlexBasis(value as FlexProps["flexBasis"]))
          .with("margin", () => getMargin(value as FlexProps["margin"]))
          .with("marginHorizontal", () => getMarginHorizontal(value as FlexProps["marginHorizontal"]))
          .with("marginVertical", () => getMarginVertical(value as FlexProps["marginVertical"]))
          .with("marginLeft", () => getMarginLeft(value as FlexProps["marginLeft"]))
          .with("marginRight", () => getMarginRight(value as FlexProps["marginRight"]))
          .with("marginTop", () => getMarginTop(value as FlexProps["marginTop"]))
          .with("marginBottom", () => getMarginBottom(value as FlexProps["marginBottom"]))
          .with("padding", () => getPadding(value as FlexProps["padding"]))
          .with("paddingHorizontal", () => getPaddingHorizontal(value as FlexProps["paddingHorizontal"]))
          .with("paddingVertical", () => getPaddingVertical(value as FlexProps["paddingVertical"]))
          .with("paddingLeft", () => getPaddingLeft(value as FlexProps["paddingLeft"]))
          .with("paddingRight", () => getPaddingRight(value as FlexProps["paddingRight"]))
          .with("paddingTop", () => getPaddingTop(value as FlexProps["paddingTop"]))
          .with("paddingBottom", () => getPaddingBottom(value as FlexProps["paddingBottom"]))
          .with("borderRadius", () => getBorderRadius(value as FlexProps["borderRadius"]))
          .with("shadow", () => getShadow(value as FlexProps["shadow"]))
          .with("backgroundColor", () => getBackgroundColor(value as FlexProps["backgroundColor"]))
          .exhaustive(),
      ]
    }, ["flex"]).filter(Boolean).join(" ");
  };

  export const Flex = ({
    children,
    flexDirection = "column",
    ...props
  }: FlexProps & { children?: React.ReactNode }) => {
    const classNames = getClassNameFromProps({
      flexDirection,
      ...props,
    });

    return <div className={classNames}>{children}</div>;
  };
  ```
</details>

<br/>

We can see that we are completely free to implement any component as we want on each platform, as long as we respect the common interface.

We can even have some platform specific props, for example, if a feature is only available on a specific platform.
Because whenever we import a component, let's say in a web project, TypeScript will automatically import the platform specific one with it's types.

Depending on the "moduleSuffixes" configuration of the project, TypeScript will resolve the correct types for the imported component, respecting the order of the suffixes.

But what if the current project doesn't have a fixed platform like our `util-shared` package? We will improve that in the next step!

## 4 - Building our design system (Box, Stack, Inline)

Box will be the first component of our design system, that uses the Flex component to normalize the styles.<br/>
It should only be used for margin, padding, borderRadius, backgroundColor and shadow.<br/>
Because we use flexbox, all our components also need to be able to set flexGrow and flexShrink.

We will need to help typescript a little bit with a `d.ts` file.

<details>
  <summary>Answer</summary>

  In the `packages/util-shared/src/components/box/Box.tsx` file:

  ```tsx
  import { Flex } from "@my-monorepo/shared/components/flex/Flex";
  import { FlexProps } from "@my-monorepo/shared/components/flex/Flex.common";
  import { FunctionComponent, ReactNode } from "react";

  type BoxProps = Omit<FlexProps, "direction" | "alignItems" | "justifyContent" | "alignSelf" | "alignContent" | "gap" | "columnGap" | "rowGap" | "wrap" | "flexWrap" | "flexDirection" | "flexBasis" | "flex" | "marginLeft" | "marginRight" | "marginTop" | "marginBottom" | "paddingLeft" | "paddingRight" | "paddingTop" | "paddingBottom">;

  const Box: FunctionComponent<BoxProps & { children: ReactNode }> = ({ children, ...props }) => {
    return <Flex {...props}>{children}</Flex>;
  };

  export { Box };
  ```

  In the `packages/util-shared/src/components/flex/Flex.d.ts` file:

  ```ts
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
  ```
</details>

Stack and Inline are simpler versions of Flex, they just have a default flexDirection of "column" and "row" respectively.<br/>
They also have a `space` prop, that is passed to the Flex component as a `gap` prop.<br/>
Inline also has a `wrap` prop, that is passed to the Flex component as a `flexWrap` prop.<br/>
Because we use flexbox, all our components also need to be able to set flexGrow and flexShrink.

<details>
  <summary>Stack implementation</summary>

  In the `packages/util-shared/src/components/stack/Stack.tsx` file:

  ```tsx
  import { Flex } from "@my-monorepo/shared/components/flex/Flex";
  import { Spacing } from "@my-monorepo/shared/components/flex/Flex.common";
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

  type StackProps = {
    space?: Spacing;
    horizontalAlign?: HorizontalAlign;
    verticalAlign?: VerticalAlign;
    flexGrow?: number;
    flexShrink?: number;
  };

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
        alignItems={horizontalAlignToAlignItemMap[horizontalAlign]}
        justifyContent={verticalAlignToAlignContentMap[verticalAlign]}
      >
        {children}
      </Flex>
    );
  };

  export { Stack };
```
</details>

<br/>

<details>
  <summary>Inline implementation</summary>

  In the `packages/util-shared/src/components/inline/Inline.tsx` file:

  ```tsx
  import { Flex } from "@my-monorepo/shared/components/flex/Flex";
  import { Spacing } from "@my-monorepo/shared/components/flex/Flex.common";
  import { FunctionComponent, ReactNode } from "react";

  export type HorizontalAlign =
    | "left"
    | "center"
    | "right"
    | "space-between"
    | "space-around";

  export type VerticalAlign = "stretch" | "top" | "center" | "bottom";

  const verticalAlignToAlignItems = {
    stretch: 'stretch',
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end',
    none: 'none',
  } as const;

  const horizontalAlignToJustifyContent = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
    'space-between': 'space-between',
    'space-around': 'space-around',
    none: 'none',
  } as const;

  type InlineProps = {
    space?: Spacing;
    horizontalAlign?: HorizontalAlign;
    verticalAlign?: VerticalAlign;
    flexGrow?: number;
    flexShrink?: number;
    wrap?: boolean;
  };

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
        alignItems={verticalAlignToAlignItems[verticalAlign]}
        justifyContent={horizontalAlignToJustifyContent[horizontalAlign]}
        flexWrap={wrap ? "wrap" : "nowrap"}
      >
        {children}
      </Flex>
    );
  };

  export { Inline };
  ```
</details>

## 5 - Making our design system responsive to multiple screen sizes

It would be nice if we could make our components adapt to the screen size.

Let's define 3 breakpoints:
- mobile: 0px - 767px
- tablet: 768px - 1023px
- desktop: 1024px - ...

We want any prop we pass to our components to be able to be set for each breakpoint.

We want to be able to do this:

```tsx
// [mobile, tablet, desktop]
<Box padding={["small", "medium", "large"]} />
```

<details>
  <summary>Answer</summary>

  You could create some types to help:
  ```ts
  type ResponsiveType<T> = T | [T | "none", T | "none", T | "none"];

  export type ResponsiveTypes<T> = {
    [key in keyof T]: ResponsiveType<T[key]>;
  };
  ```

  Then you can use it like this:
  ```ts
  export type ResponsiveFlexProps = ResponsiveTypes<FlexProps>;
  export type ResponsiveBoxProps = ResponsiveTypes<BoxProps>;
  export type ResponsiveInlineProps = ResponsiveTypes<InlineProps>;
  export type ResponsiveStackProps = ResponsiveTypes<StackProps>;
  ```

  You now need to implement the logic to make it work for Flex for each of your implementations.

  If you use tailwind and css meida queries, you can do something like this:
  (Do not forget to force tailwind to bundle the classes since we are doing some dynamic stuff and it's not meant for that)
  ```tsx
  const makeResponsive = <T,>(func: (T) => string) => {
    return (value: T | [T | "none", T | "none", T | "none"]) => {
      if (!Array.isArray(value)) {
        return func(value);
      }

      return value
        .map((v, i) => {
          if (v === "none") {
            return undefined;
          }

          return `${match(i as 0 | 1 | 2)
            .with(0, () => "max-md:")
            .with(1, () => "md:max-lg:")
            .with(2, () => "lg:")
            .exhaustive()}${func(v)}`;
        })
        .filter(Boolean)
        .join(" ");
    };
  };
  ```

  if you use stylesheets there is no media queries, but you can do something like this:
  ```tsx
  const screenWidth = getScreenWidth();
  const index = match(screenWidth)
    .when((width) => width >= 1280, () => 2)
    .when((width) => width >= 768, () => 1)
    .otherwise(() => 0);
  ```

  And use it like this:
  ```tsx
  export const getSpacingValue = (spacing: ResponsiveType<Spacing>) => {
    return match(Array.isArray(spacing) ? spacing[index] : spacing)
      .with("small", () => 4)
      .with("medium", () => 8)
      .with("large", () => 16)
      .with("none", () => 0)
      .exhaustive();
  };
  ```
</details>

## 6 - Bonus components - if you want to go further

You can now implement bonus components like Button, Image, and many more!