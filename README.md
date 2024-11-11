# monorepo-workshop

## 0 - Setup a monorepo with mixed projects

<details>
  <summary>Setting up a monorepo</summary>
  One directory with many projects
  - Let's initialize one web project with Vite and one native project with Expo.

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
(Caveat: different imports could mess with resolution - let's see how to fix that)

## 2 - Sharing some platform specific logic

Let's see how shared code behave when there are platform specificities

## 3 - Assembling those bricks to create a design system

Let's see how to define primitives components that can be shared between web & native

## 4 - React Strict Dom ? React Native web ?

How what we build works with the past and future of web sharing technologies