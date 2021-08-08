/* eslint-disable global-require */
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  eslint: {
    enable: false,
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  webpack: {
    configure: (webpackConfig) => ({
      ...webpackConfig,
      optimization: {
        ...webpackConfig.optimization,
        // Workaround for CircleCI bug caused by the number of CPUs shown
        // https://github.com/facebook/create-react-app/issues/8320
        minimizer: webpackConfig.optimization.minimizer.map((item) => {
          if (item instanceof TerserPlugin) {
            item.options.parallel = 0;
          }

          return item;
        }),
      },
    }),
  },
};
