module.exports = {
  presets: [
    "babel-preset-expo", // This preset is used for Expo projects (React Native)
    // "@babel/preset-env",
    // "@babel/preset-react",
    // "module:metro-react-native-babel-preset",
  ],
  plugins: [
    "@babel/plugin-transform-class-static-block", // Add this plugin
  ],
};
