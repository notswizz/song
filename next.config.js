module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      console.log('Webpack config:', config);
      return config;
    },
  };