const { merge } = require('webpack-merge')
const webpack = require('webpack')
const dotenv = require('dotenv')
const zlib = require('zlib')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const common = require('./webpack.common.js')

// Loads environment variables from .env.production file.
dotenv.config({ path: '.env.production' })

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            REACT_APP_API_DIRECTORY: process.env.REACT_APP_API_DIRECTORY,
            REACT_APP_WEB_DIRECTORY: process.env.REACT_APP_WEB_DIRECTORY,
            REACT_APP_CLOUDINARY_NAME: process.env.REACT_APP_CLOUDINARY_NAME,
            REACT_APP_GOOGLEMAPS_API: process.env.REACT_APP_GOOGLEMAPS_API,
            REACT_APP_GOOGLETAGMANAGER_ID:
                process.env.REACT_APP_GOOGLETAGMANAGER_ID,
            REACT_APP_FACEBOOK_APP_ID: process.env.REACT_APP_FACEBOOK_APP_ID,
        }),
        new CompressionPlugin({
            algorithm: 'brotliCompress',
            test: /\.(js|css|html)$/,
            compressionOptions: {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                },
            },
        }),
    ],
})
