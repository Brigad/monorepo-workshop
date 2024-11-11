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

Let's see how shared code behave when there are platform specificities

## 3 - Assembling those bricks to create a design system

Let's see how to define primitives components that can be shared between web & native

## 4 - React Strict Dom ? React Native web ?

How what we build works with the past and future of web sharing technologies