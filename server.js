const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.dev.js');
const compiler = webpack(webpackConfig);

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/public'));

app.use(
	webpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath,
		stats: {
			colors: true,
		},
	})
);

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response) {
	response.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const server = app.listen(9000, function () {
	const host = server.address().address;
	const port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});
