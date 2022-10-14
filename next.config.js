// @ts-check
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(
                __dirname,
                'node_modules/cesium/Build/Cesium'
              ),
              to: '../public/cesium',
            },
          ],
        })
      )
    }
    config.resolve.exportsFields = []
    // return {...config, resolve: {...config.resolve, exportsFields:[]}}
    return config
  },
}

module.exports = nextConfig
