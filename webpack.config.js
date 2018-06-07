const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const autoprefixer = require('autoprefixer');

const pkg = require('./package');


const PLATFORMS = ['dna','jd','gome'] ;//one of 'dna' 'jd' 'gome'

module.exports = function(env={}) {

    let isProd,platform,protocol;
    if(env.prod){
        process.env.BABEL_ENV = 'production';
        process.env.NODE_ENV = 'production';
        isProd = true;
    }else{
        process.env.BABEL_ENV = 'development';
        process.env.NODE_ENV = 'development';
    }

    if(env.platform && PLATFORMS.indexOf(env.platform)>=0){
        platform = env.platform;
    }else if(env.broswer){
        //如果是浏览器环境，则默认使用mock
        platform = 'mock';
    }else{
        platform = PLATFORMS[0];
        env.platform &&
        console.error(`not supported platform ${env.platform},reset to ${PLATFORMS[0]}`);
    }

    if(env.protocol){
        if(PLATFORMS.indexOf(env.protocol)>=0){
            protocol = env.protocol;
        }else{
            throw new Error(`not supported protocol ${env.protocol}!}`)
        }
    }else{
        protocol = PLATFORMS[0];
    }

    const htmlOutputName =  platform === 'dna'?'app.html':'index.html';
    const appPublicPath =  path.resolve(__dirname, 'public');
    const appBuildPath =  path.resolve(__dirname, 'build');

    const plugins =[
        new HtmlWebpackPlugin({
            inject: true,
            filename:htmlOutputName,
            platform:platform,
            template: path.resolve(appPublicPath,'index.html'),
            minify: isProd && {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.PROTOCOL': JSON.stringify(protocol),
            'THEME_COLOR':JSON.stringify(pkg.theme['@theme-color'])
        }),
        new CleanWebpackPlugin(['dist', 'build'],{
            root: __dirname,
            verbose: true,
        }),
        new ExtractTextPlugin({
            filename: '[name].[contenthash:8].css',
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new CopyWebpackPlugin([{
            from: appPublicPath,
            to:appBuildPath
        }],{ignore: ['index.html']})
    ];

    if(isProd){
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    // Disabled because of an issue with Uglify breaking seemingly valid code:
                    // https://github.com/facebookincubator/create-react-app/issues/2376
                    // Pending further investigation:
                    // https://github.com/mishoo/UglifyJS2/issues/2011
                    comparisons: false,
                },
                mangle: {
                    safari10: true,
                },
                output: {
                    comments: false,
                    // Turned on because emoji and regex is not minified properly using default
                    // https://github.com/facebookincubator/create-react-app/issues/2488
                    ascii_only: true,
                },
                sourceMap:true
                //sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)
            })
        );

    }

    return {
        devtool: isProd?"source-map":"eval",
        entry: [ './src/polyfills.js', './src/index.js'],
        output: {
            filename: '[name].[chunkhash:8].js',
            chunkFilename: '[name].[chunkhash:8].chunk.js',
            path:platform === 'dna'? path.resolve(appBuildPath, 'zh-cn') : appBuildPath
        },
        devServer: {
            contentBase: appPublicPath,
            historyApiFallback: {
                rewrites: [
                    { from: /^\/$/, to: '/'+htmlOutputName },
                ]
            }
        },
        resolve: {
            alias:{
                adapter:path.resolve(require.resolve('broadlink-jssdk'),'../',platform)
            }
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    sourceMap: true,
                                    minimize: true,
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    // Necessary for external CSS imports to work
                                    // https://github.com/facebookincubator/create-react-app/issues/2677
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9', // React doesn't support IE8 anyway
                                            ],
                                            flexbox: 'no-2009',
                                        }),
                                    ],
                                },
                            },
                        ]
                    })
                },
                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    sourceMap: true,
                                    minimize: true,
                                    modules:true
                                }
                            },
                            {
                                loader: require.resolve('less-loader'),
                                options:{
                                    sourceMap: true,
                                     modifyVars: pkg.theme
                                }
                            }
                        ]
                    })
                },
                // {
                //     test: /\.html$/,
                //     use: [ {
                //         loader: 'html-loader',
                //         options: {
                //             //dont compress html code
                //             minimize: false
                //         }
                //     }]
                // },
                {
                    test: /\.(png|jpg|svg|gif)$/,
                    use: [ {
                        loader: 'url-loader',
                        options: {
                            limit:10000,
                            outputPath:"static/",
                        }
                    }]
                },
                {
                    test: /\.js$/,
                    include: [
                        path.resolve(__dirname,'src'),
                        path.resolve(require.resolve('broadlink-jssdk'),'..'),
                        path.resolve(require.resolve('broadlink-reactui'),'..')],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: !isProd,
                            compact: isProd,
                            presets: ['react-app']
                        }
                    }
                },
            ]
        },
        plugins:plugins
    }

};


