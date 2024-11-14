const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

config.watchFolders = [monorepoRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

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

module.exports = config;
