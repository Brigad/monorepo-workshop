# monorepo-workshop

## Setup a monorepo with mixed projects

We want to create a monorepo with a web project and a native project.

I will use vite, expo and yarn but feel free to use what you want.

<details>
  <summary><strong>Answer:</strong> Setting up a monorepo</summary>

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
  <summary><strong>Answer:</strong> Creating the util-shared package</summary>

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
  Let's add a simple function in the `src/sayHelloWorld.ts` file:

  <details>
    <summary><strong>Answer:</strong> Adding the sayHelloWorld function</summary>

    In the `src/sayHelloWorld.ts` file:

    ```ts
    export function sayHelloWorld() {
      console.log("Hello World");
    }
    ```
  </details>

  Let's import and use the `sayHelloWorld` function in the `my-web-app` and the `my-native-app` projects

  <details>
    <summary><strong>Answer:</strong> Using the sayHelloWorld function</summary>

    In the `packages/my-web-app/src/App.tsx` && `packages/my-native-app/app/(tabs)/index.tsx` files:

    ```tsx
    import { sayHelloWorld } from "@my-monorepo/util-shared";

    sayHelloWorld();
    ```
  </details>

## 2 - Sharing some platform specific logic

Let's see how shared code behave when there are platform specificities

## 3 - Assembling those bricks to create a design system

Let's see how to define primitives components that can be shared between web & native

## 4 - React Strict Dom ? React Native web ?

How what we build works with the past and future of web sharing technologies