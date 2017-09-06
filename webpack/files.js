module.exports = function(path) {
    return {
        module: {
            rules: [
                {
                    test: /\.(jpg|png|svg)$/,
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[ext]'
                    },
                },
                {
                    test: /\.json$/,
                    loader: 'file-loader',
                    options: {
                        name: 'json/[name].[ext]'
                    },
                }
            ],
        },
    };
};