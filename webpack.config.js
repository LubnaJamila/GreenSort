// Simple redirect ke config mode
module.exports = (env) => {
  if (env.production) {
    return require("./webpack/webpack.prod.js");
  } else {
    return require("./webpack/webpack.dev.js");
  }
};
