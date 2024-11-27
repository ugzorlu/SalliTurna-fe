const path = require('path')
const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    module: {
        rules: [
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(s[ac]ss|css)$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                type: 'asset',
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all', // Split both synchronous and asynchronous code
            cacheGroups: {
                reactVendor: {
                    test: /[\\/]node_modules[\\/](react|react-dom|react-redux|react-router-dom|react-helmet-async)[\\/]/, // Match react-related libraries
                    name: 'react-vendor',
                    chunks: 'all',
                    priority: 20, // Higher priority than other vendors
                },
                otherVendors: {
                    test: /[\\/]node_modules[\\/]/, // Match files from node_modules
                    name: 'vendors', // Name the vendor chunk
                    chunks: 'all',
                    priority: 10, // Higher priority for vendors
                },
                default: {
                    minChunks: 2, // Reuse chunks shared by at least two modules
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    plugins: [new BundleAnalyzerPlugin()],
    output: {
        path: path.join(__dirname, 'public/bundles'),
        filename: '[name].js',
        publicPath: '/bundles/',
        assetModuleFilename: 'img/[hash][ext][query]',
    },
}
