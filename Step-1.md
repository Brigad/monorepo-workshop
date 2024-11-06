Setting up a monorepo:

One directory with many projects
- Let's initialize one web project with Vite and one native project with Expo.

```
mkdir packages
cd packages

npm create vite@latest
npx create-expo-app@latest
```

Let's set up a monorepo with yarn:

```
yarn init
yarn set version stable
yarn install
```

Let's set the node linker to node-modules in the `.yarnrc.yml` file:

```
nodeLinker: node-modules
```

Let's add the two projects as workspaces in the `package.json` file:

```
"workspaces": [
  "packages/*"
]
```
