/**
 * @type {import('next').NextConfig}
 */


module.exports = {
  distDir: 'build',
  webpack: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      modules: [
        ...config.resolve.modules,
        __dirname + '/src'
      ]
    }
  })
}
