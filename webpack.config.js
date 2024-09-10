const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ensure that the mode is defined
  config.mode = argv.mode || "development"; // Choose between 'development' or 'production'

  return config;
};
