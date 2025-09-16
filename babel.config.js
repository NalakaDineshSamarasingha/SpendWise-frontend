module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // expo-router/babel is deprecated in SDK 50+; babel-preset-expo covers needed transforms
      'react-native-worklets/plugin',
    ],
  };
};
