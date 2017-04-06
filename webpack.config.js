/**
 * sleepingkiwi - base webpack config.
 * ===================================
 * - part of the `sleepingkiwi react starter` repo,
 *   see the repo readme.md for more thought process and references
 *   https://webpack.js.org/configuration/ is a great reference to all of the object properties
**/

/** Why is there not a separate dev/prod config?
 *  --------------------------------------------
 *  Because there's a lot of shared overhead between dev/prod we're currently using one file
 *   for both and passing an env.production boolean which we use to change any required values
 *   it means we can keep our simple webpack config neatly in one file.
 *   If this starts to feel a bit too messy, see notes in /readme.md about `webpack-merge`
 *
 *  We mostly use conditionals like so:
 *   `devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',`
 *   however in more complex situations we use self executing functions
 *   see the `devServer` entry for more info
**/

/** required plugins and imports
 *  ----------------------------
 *  see the /readme.md in the `sleepingkiwi react starter` repo for plugin details
**/
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

  // the `remove: false` rule stops autoprefixer from removing prefixes that we manually insert
  // this gives us more granular control to support older browsers on a case-by-case basis.
const Autoprefixer = require('autoprefixer')({ remove: false });
const Stylelint = require('stylelint');

/** webpack config object
 *  ---------------------
 *  This syntax, where module.exports is a function that takes an env object as an argument
 *   and returns the webpack config object, allows us to pass environment variables via the CLI
 *   or package.json scripts in format `webpack -p --env.production --env.platform=web --progress`
 *   ref: https://blog.flennik.com/the-fine-art-of-the-webpack-2-config-dc4d19d7f172
 *   ref: https://webpack.js.org/guides/production-build/
**/
module.exports = (env = {}) => {
    /** isProduction variable
     *  ---------------------
     *  Used throughout this config to check whether we're building for production or development
    **/
  const isProduction = env.production === true;

    /** ASSET_PATH const
     *  ----------------
     *  defining this as a variable means we can pass the asset path (for public files)
     *   through the build command (--env.ASSET_PATH='https://some-cdn.cdn')
     *   '/' is fine for dev, may need to replace with CDN etc. for prod...
     *   ref: https://webpack.js.org/configuration/output/#output-publicpath
    **/
  const ASSET_PATH = env.ASSET_PATH || '/';

    /** array of config objects
     *  -----------------------
     *  Potentially useful to return the client and server configs in one file...
     *  TODO: investigate if this is a good approach...
    **/
  return [
      /** client side bundle configuration
       *  --------------------------------
       *  ref: https://webpack.js.org/configuration/
      **/
    {
        /** sourcemaps
         *  ----------
         *  - full sourcemaps for production,
         *  - cheap/fast/no column numbers for dev
        **/
      devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',

        // client side gets web, server needs 'node'
      target: 'web',

        // we set context as root directory and then use shared/ or client/ as required
      context: __dirname,

        // the entry point(s) are where webpack starts bundling
      entry: {
        main: [
          './client/index.jsx',
        ],
      },

        // where and how we ouput our bundled files
      output: {
          /** bundle build path
           *  -----------------
           *  only relevant to production because dev server compiles to memory
          **/
        path: path.resolve(__dirname, 'dist/client'),

          /** output filename format
           *  ----------------------
           *  [name] is replaced by the key in the entry {} object
           *  [chunkhash] changes only when file content changes
           *  so using [name].[chunkhash] allows us to use long term caching in production.
           *  TODO: maybe naive prod cache solution? look at https://webpack.js.org/guides/caching/
          **/
        filename: isProduction ? '[name].[chunkhash].js' : '[name].js',

          // see const definition above for more info on ASSET_PATH
        publicPath: ASSET_PATH,

          /** Debug comments in output
           *  ------------------------
           *  outputs comments in the bundled files with details of path/tree shaking
           *   should be false in production, true for development
          **/
        pathinfo: !isProduction,
      },

        // rules for how webpack should resolve/find file names.
        // https://webpack.js.org/configuration/resolve
      resolve: {
          /** importing without extensions
           *  ----------------------------
           *  these are the filetypes that we can import without their extensions if we want.
           *   i.e import Header from '../shared/components/Header/Header';
           *  the '*' allows us to also include an explicit extension if we want (i.e. .jpg)
           *  ref: https://webpack.js.org/configuration/resolve/#resolve-extensions
           *  ref: http://stackoverflow.com/questions/37529513/why-does-webpack-need-an-empty-extension
          **/
        extensions: ['.js', '.jsx', '.json', '*'],
        alias: {
          Public: path.resolve(__dirname, 'public'),
          Shared: path.resolve(__dirname, 'shared'),
        },
      },

        /** configuring webpack cli output
         *  ------------------------------
         *  controls how much info we output. Only used in prod, webpack-dev-server has it's own!
         *  ref: https://webpack.js.org/configuration/stats/
        **/
      stats: 'normal',

        // performance hints for large file sizes
      performance: (() => {
          // see the devServer entry for explanation of this function syntax (() => {})()
        if (isProduction) {
          return {
              // could set to error for production...
            hints: 'warning',

              // each 'entry' bundle (250kb)
            maxEntrypointSize: 250000,

              // any individual assets (250kb)
            maxAssetSize: 250000,
          };
        }
          // development doesn't show performance hints currently
        return {};
      })(),

        /** webpack plugins
         *  ---------------
         * Array of plugins used to expand webpack functionality
         *  we finish this array with [].filter(plugin => plugin != null),
         *  which removes any empty entries
         *  i.e. `[1,2,,4,5,6].filter(p => p != null)` -- would return --> [1, 2, 4, 5, 6]
         *  this allows us to conditionally include plugins based on the dev/production env.
        **/
      plugins: [

          /** creating global constants
           *  -------------------------
           *  creates global constants - ref: https://webpack.js.org/plugins/define-plugin/
           *   for example we could call WEBPACK_ASSET_PATH anywhere in our bundled code
          **/
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development'),
          WEBPACK_ASSET_PATH: JSON.stringify(ASSET_PATH),
        }),

          /** index HTML template
           *  -------------------
           *  uses a template to generate an HTML file which references our bundled code
           *   ref: https://github.com/jantimon/html-webpack-plugin#configuration
          **/
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, 'client/index.ejs'),
          inject: true,
            // this option seemed to consistently cause issues in production if true...
          cache: false,
        }),

          /** async/defer in index
           *  --------------------
           *  lets us add async and defer properties to the scripts pulled in by HtmlWebpackPlugin
           *   ref: https://github.com/numical/script-ext-html-webpack-plugin
          **/
        new ScriptExtHtmlWebpackPlugin({
            // add defer and async to all .js files
          defer: /\.js$/,
          async: /\.js$/,
        }),

          /** [production only] Uglify
           *  ------------------------
          **/
          // see the devServer entry for explanation of this self executing function syntax
        (() => {
          if (isProduction) {
              // uglify in production
            return new webpack.optimize.UglifyJsPlugin({
              compress: {
                  // react doesn't support IE8 anyway
                screw_ie8: true,
                  // don't tell us about all the dead code you're removing!
                warnings: false,
              },
              comments: false,
            });
          }
            // return null in development, this is then stripped away by our array filter.
          return null;
        })(),

          /** [production only] Extract Text Plugin
           *  -------------------------------------
           *  writes our bundled css to a file with the given name!
          **/
        (() => {
          if (isProduction) {
            return new ExtractTextPlugin('[name].[contenthash].css');
          }
            // return null in development, this is then stripped away by our array filter.
          return null;
        })(),

      ].filter(plugin => plugin != null), // see note at start for .filter explanation...

        /** webpack loaders
         *  ---------------
         *   the various loaders we use to handle files of different types through webpack
        **/
      module: {
        rules: [
            /** eslint
             *  ------
             *  Run all of our .js and .jsx files through eslint.
             *   eslint is configured in package.json
             *   this runs first, before babel has a chance to transpile
            **/
          {
              // make sure this happens first, before babel transpiles things
            enforce: 'pre',
              // .js or .jsx files
            test: /\.(js|jsx)$/,
              /** what include actually means
               *  ---------------------------
               *  basically only lints files in these directories!
               *   (other js/jsx imports, for example from node_modules,
               *   will still  be bundled but not linted by this loader)
              **/
            include: [
              path.resolve(__dirname, 'shared'),
              path.resolve(__dirname, 'client'),
            ],
              // Run eslint on the .js and .jsx files that we've found
            use: 'eslint-loader',
          },

            /** babel
             *  -----
             *  Run all of our .js and .jsx files through babel.
             *   babel allows us to use ES6 features that aren't widely supported and
             *   transpiles them back to ES5...
            **/
          {
              // .js or .jsx files
            test: /\.(js|jsx)$/,
              // only transpile files in /shared and /client
            include: [
              path.resolve(__dirname, 'shared'),
              path.resolve(__dirname, 'client'),
            ],
              // Transpile all .js and .jsx files with babel
            use: 'babel-loader',
          },

            /** public file loading with file-loader
             *  ------------------------------------
             *  file-loader lets us import any file as a URL like:
             *  - `import logo from './logo.png';`
             *  - `return <img src={logo} alt="Logo" />;`
             *
             *  For our purpose we want to avoid maintaining a list of all the filetypes that
             *  we might one day want to load through webpack `test: /\.(ico|jpg|jpeg|png.....`
             *  Instead we let file-loader load everything that we haven't explicitly excluded
             *
             *  We're running file-loader without a test, so it basically matches everything.
             *  we manually exclude files that are processed with the other loaders
             *  (because if they're processed by other loaders we don't need to load twice)
            **/
          {
            exclude: [
              /\.html$/,
              /\.ejs$/,
              /\.(js|jsx)$/,
              /\.css$/,
              /\.scss$/,
              /\.json$/,
              /\.bmp$/,
              /\.gif$/,
              /\.jpe?g$/,
              /\.png$/,
              path.resolve(__dirname, 'public/root'),
            ],
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'static/media/[name].[hash:8].[ext]',
                },
              },
            ],
          },

            /** static files from root
             *  ----------------------
             *  The files in public/root don't have their names transformed and are served from
             *  the root. This covers things like favicon.ico and robots.txt
            **/
          {
            include: [
              path.resolve(__dirname, 'public/root'),
            ],
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                },
              },
            ],
          },

            /** URL loader to potentially embed data URLs
             *  -----------------------------------------
             *  url-loader works the same as file-loader unless the files are below a certain size
             *  threshold, in which case it embeds the file as a data-uri instead to save a request.
             *  clever shit.
            **/
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            use: [
              {
                loader: 'url-loader',
                options: {
                  // 6kb threshold for embedding
                  limit: 6000,
                  name: 'static/media/[name].[hash:8].[ext]',
                },
              },
            ],
          },

            /** SCSS to CSS, with autoprefixer and stylelint
             *  --------------------------------------------
            **/
          {
            test: /\.scss/,
            use: (() => {
                // using a self executing function here to conditionally return prod/dev arrays
              if (isProduction) {
                  /** Styles in production
                   *  --------------------
                   *  Loaders run bottom to top...
                   *
                   *  for production we've wrapped this all in our ExtractTextPlugin
                   *  (which is setup in the plugins config ^^), this outputs the bundled css
                   *  into a file, which is injected into our HTML template by HtmlWebpackPlugin
                  **/
                return ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: [
                      /** Finally parse import/url() rules
                       *  --------------------------------
                      **/
                    {
                      loader: 'css-loader',
                      options: {
                        sourceMap: true,
                      },
                    },
                      /** Third autoprefix the css
                       *  ------------------------
                       *  Autoprefixer uses the browserlist in package.json by default,
                       *  we also pass extra options to it when we `require()` it at the top ^^
                       *  this has to run after the sass is converted to css which is why there
                       *  are two separate postcss-loader blocks. One to lint, one to prefix
                      **/
                    {
                      loader: 'postcss-loader',
                      options: {
                        plugins: [
                            // we specify some rules for Autoprefixer where we `require` it
                            // at the top of this file...
                          Autoprefixer,
                        ],
                      },
                    },
                      /** Second convert our sass to standard css
                       *  ---------------------------------------
                       *  this runs node-sass with the options we pass it!
                      **/
                    {
                      loader: 'sass-loader',
                      options: {
                        sourceMap: true,
                        outputStyle: 'compressed',
                      },
                    },
                      /** First lint our non-transformed css
                       *  ----------------------------------
                       *  this runs first so that we lint before sass-loader compresses the code!
                      **/
                    {
                      loader: 'postcss-loader',
                      options: {
                          // we install postcss-scss in package.json.
                          // it is a parser that allows postcss to understand scss syntax
                          // we're running stylelint on our .scss code, so we need this parser here
                        parser: 'postcss-scss',
                        plugins: [
                            // this const is brought in with `require()` at the top of this file
                          Stylelint,
                        ],
                      },
                    },
                  ],
                });
              }
                /** Styles in development
                 *  ---------------------
                 *  Loaders run bottom to top...
                 *  the main difference for dev is that we use style-loader:
                 *  style-loader bundles css with our js and injects it into the page at
                 *  runtime... - this is useful in development as it is fast
                 *  and allows for hot reloading.
                **/
              return [
                {
                  loader: 'style-loader',
                },
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: true,
                  },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    plugins: [
                      Autoprefixer,
                    ],
                  },
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
                    outputStyle: 'compressed',
                  },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                      // we install postcss-scss in package.json.
                      // it is a parser that allows postcss to understand scss syntax
                      // we're running stylelint on our .scss code, so we need this parser here
                    parser: 'postcss-scss',
                    plugins: [
                      Stylelint,
                    ],
                  },
                },
              ];
            })(),
          }, // .scss test
        ], // rules: [ ...
      }, // module: { ...

        // configuring webpack-dev-server in development only
        // ref: https://webpack.js.org/configuration/dev-server/#devserver
      devServer: (() => {
          /** using self executing functions as object literal property values
           *  ----------------------------------------------------------------
           *  ref: https://blog.flennik.com/the-fine-art-of-the-webpack-2-config-dc4d19d7f172
           *  this technique lets us use more complex conditionals
           *   to assign the values of properties right inside the body of the object literal.
           *   Neat trick!
          **/
        if (isProduction) {
            // no devServer in production...
          return {};
        }
        return {
          stats: 'normal',
          port: 9069,
            // serving public files
          contentBase: path.resolve(__dirname, 'public'),
            // an example proxy - for making external API calls to services without CORS.
          /*proxy: {
            '/some-api': {
              target: 'http://localhost:3000',
                // this rewrite strips '/some-api' from the request. Without it a request to
                // `/some-api/test` would be rewritten to `http://localhost:3000/some-api/test`
                // with the pathRewrite below it would be rewritten to `http://localhost:3000/test`
              pathRewrite: { '^/some-api': '' },
            },
          },*/
        };
      })(),
    }, // client config object
        /** TODO: server config!
         * A GOOD OPTION MIGHT JUST BE TO USE ENV.PLATFORM ARGUMENT?
         * - otherwise:
         * return array of two configs ???
         * ---------------------------
         * - we will need a separate config for our server and client code
         *   webpack allows us to pass them as separate objects in an array and they are then
         *   processed at the same time...
         *   TODO: investigate if this is best approach when filling out server [upgrade] docs
         *   ref: http://stackoverflow.com/questions/37369053/webpack-babel-config-for-both-server-and-client-javascript
        **/
        /**
         * server side bundle configuration
         * --------------------------------
         * ref: https://webpack.js.org/configuration/
        **/
        /*{
          target: 'node',
          context: __dirname,
          entry: {
            main: [
              './server/index.js',
            ],
          },
        },*/
  ];// return [{...client webpack config},{...server webpack config}]
};// module.exports = (env = {}) => {
