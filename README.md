# monorepo-workshop

## Setup a monorepo with mixed projects

We want to create a monorepo with a web project and a native project.

I will use vite, expo and yarn but feel free to use what you want.

<details>
  <summary><strong>Answer</strong></summary>

  ```sh
  mkdir packages
  cd packages

  npm create vite@latest
  npx create-expo-app@latest
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


## 1 - Sharing some common logic

Let's create a util-package that will be accessible within the respective projects

<details>
  <summary><strong>Answer</strong></summary>

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

Let's add a simple function in the `src/sayHelloWorld.ts` file:

<details>
  <summary><strong>Answer</strong></summary>

  In the `packages/util-shared/src/utils/sayHelloWorld.ts` file:

  ```ts
  export function sayHelloWorld() {
    console.log("Hello World");
  }
  ```
</details>

Let's import and use the `sayHelloWorld` function in the `my-web-app` and the `my-native-app` projects

<details>
  <summary><strong>Answer</summary>

  In the `packages/my-web-app/src/App.tsx` && `packages/my-native-app/app/(tabs)/index.tsx` files:

  ```tsx
  import { sayHelloWorld } from "@my-monorepo/util-shared";

  sayHelloWorld();
  ```
</details>

Let's make a hook that uses the `sayHelloWorld` function:

<details>
  <summary><strong>Answer</strong></summary>

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

What if we were to use a different version of react in shared than in the native project ?

<details>
  <summary><strong>Answer</strong></summary>

  Let's add react 18.3.1 as a dependency in the `packages/util-shared/package.json` file:

  ```json
  "dependencies": {
    "react": "18.3.1"
  }
  ```
</details>

Let's now use the `useSayHelloWorld` hook in the `my-native-app` project

<details>
  <summary><strong>Answer</strong></summary>

  In the `packages/my-native-app/app/(tabs)/index.tsx` file:

  ```tsx
  import { useSayHelloWorld } from "@my-monorepo/util-shared";

  useSayHelloWorld();
  ```
</details>

## 2 - Sharing some platform specific logic

Let's see how shared code behave when there are platform specificities

## 3 - Assembling those bricks to create a design system

Let's see how to define primitives components that can be shared between web & native

## 4 - React Strict Dom ? React Native web ?

How what we build works with the past and future of web sharing technologies