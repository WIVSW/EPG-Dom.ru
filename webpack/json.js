require('../src/json/channels.json');
require('../src/json/programms.json');

module.exports = function() {
	return {
	  module: {
	    loaders: [
	      {
	        test: /\.json$/,
	        loader: 'json-loader',
	        options: {
	            name: 'json/[name].[ext]'
	        }
	      }
	    ]
	  }
	} 
}