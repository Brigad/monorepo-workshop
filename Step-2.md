Let's create a util-package that will be accessible within the respective projects

```
mkdir packages/util-shared
cd packages/util-shared
yarn init
```

Let's add a simple function in the `src/sayHelloWorld.ts` file:

```
export function sayHelloWorld() {
  console.log("Hello World");
}
```

Let's add our package as a dependency to the `my-web-app` & `my-native-app` projects

We can now use the `sayHelloWorld` function in the `my-web-app` & `my-native-app` projects

We can define import aliases in the `tsconfig.json` file to make it easier to import the package
```
"paths": {
  "@my-monorepo/shared/*": ["../util-shared/src/*"]
}
```

What if our dependencies have different versions ? How to enforce a single version is being used for each package ?
=> let's create useSayHelloWorld.ts file in the shared project and add react 18.3.1 as a dependency

Web is OK
Native is KO

=> Let's fix the native project by adding a metro.config.js file

We can use metro to force the resolution in many ways.
 - In the past we used to do that with babel-plugin-module-resolver
 - Now we can use the resolver.resolveRequest method in metro.config.js to do that


