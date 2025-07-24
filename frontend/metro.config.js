const { getDefaultConfig } = require("expo/metro-config");
// Temporarily disabled NativeWind due to parseAspectRatio error in react-native-css-interop
// const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

// module.exports = withNativeWind(config, { input: './global.css' })
module.exports = config