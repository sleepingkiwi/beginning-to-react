> __This is very much a work in progress.__
> Once we have completed all todos and are somewhat stable. this message will be removed.

# beginning to react
#### starting a react project with [sleepingkiwi](https://github.com/sleepingKiwi) and friends.

This is a basic starting point for building universally rendered react applications, integrating react/redux with express whilst keeping some of the DX (live/hot reloads) offered by webpack-dev-server. Includes examples of using universal-fetch from the server to interact with an api which is not staged locally.

- Integrates some resources and ideas from an ejected [Create React App](https://github.com/facebookincubator/create-react-app) with several modifications and updates.
- For Javascript uses Airbnb's [style guide](https://github.com/airbnb/javascript) enforced through their linting preset in ESlint
- Basic processes (writing this document) inspired by [Build your own starter](http://andrewhfarmer.com/build-your-own-starter).
- Redux implementation based on examples from [redux.js.org](http://redux.js.org/docs/recipes/ServerRendering.html), [css tricks](https://css-tricks.com/learning-react-redux/) and [scotch.io](https://scotch.io/tutorials/build-a-bookshop-with-react-redux-i-react-redux-flow).
- Webpack configuration based on ideas from [this article by Alexander Flenniken](https://dev.to/alflennik/the-fine-art-of-the-webpack-2-config), [this scotch.io article](https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel) and this [article on tree shaking by Jake Wiesler](https://medium.freecodecamp.com/tree-shaking-es6-modules-in-webpack-2-1add6672f31b#.h12g38b3j)

### contents _(setup and client side rendering)_

- [create directory and setup git](#create-directory-and-setup-git)
- [create package.json, add basic dependancies](#create-packagejson-add-basic-dependancies)
- [add babel and config](#add-babel-and-config)
- [add eslint and config](#add-eslint-and-config)
- [directory structure](#directory-structure)
- [webpack base config](#webpack-base-config)
- [sass with stylelint and autoprefixer](#sass-with-stylelint-and-autoprefixer)
- [scripts in package.json](#scripts-in-packagejson)
- [[optional]: example content & bringing in our global styling framework ](#optional-example-content-bringing-in-our-global-styling-framework)
- [client side routing and rendering](#client-side-routing-and-rendering)
- [redux and the store](#redux-and-the-store)
- [asynchronous requests with thunks and universal fetch](#asynchronous-requests-with-thunks-and-universal-fetch)

### contents _(introducing the server)_
> If you only follow the instructions up to this point you should have a fully functional react app that renders entirely on the client side. The steps below introduce server side rendering into the mix!

- [[upgrade] - adding express server](#upgrade-adding-express-server)
- [[upgrade] - webpack-dev-middleware and live reloads on express for development](#upgrade-webpack-dev-middleware-and-live-reloads-on-express-for-development)
- [[upgrade] - webpack-hot-middleware and enabling HMR on server for development](#upgrade-webpack-hot-middleware-and-enabling-HMR-on-server-for-development)
- [[upgrade] - rendering from the server](#upgrade-rendering-from-the-server)
- [[upgrade] - handling async on the server](#upgrade-handling-async-on-the-server)
- [[upgrade] - handling forms universally](#upgrade-handling-forms-universally)

### contents _(optional, notes and todos)_

- [browser support and polyfills](#browser-support-and-polyfills)
- [[optional]: deferred font loading with fallback fonts](#optional-deferred-font-loading-with-fallback-fonts)
- [unit testing](#unit-testing)
- [todos](#todos)

---

## create directory and setup git

just regular old _new project_ steps

### 1. Make project directory and `cd` into it
```
$ mkdir rad-project
$ cd rad-project
```


### 2. Add _readme.md_ and add some basic info to it
```
$ touch readme.md
$ atom ./
```


### 3. Add .gitignore

- maybe start with [our standard .gitignore file](https://gist.github.com/sleepingKiwi/cd4933f0f84470bd0a290077e90f39cc)


### 4. Set up git repo
```
$ git init
$ git add .
$ git commit -m 'initial commit'
```


### 5. Push to github  

 -  create a repo on github without license/readme/gitignore and grab the repo URL
  - https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/

```  
$ git remote add origin 'remote/repository/URL'
# verify that URL works
$ git remote -v
$ git push -u origin master
```

## create package.json, add basic dependancies

- We add [react](https://facebook.github.io/react/)  (and a couple of deps) which are used for building front-end components.
- We also add [react router](https://github.com/ReactTraining/react-router) which we can use to define routes within our application.
- Finally we add [redux](http://redux.js.org/), a state container. Similar in concept to _flux_, which we use to manage our application state.

### 1. add default package.json
```
# accepts all defaults (-y)
npm init -y
```

### 2. make tweaks to it.
- for private repos add `"private": true,`
- add a `"description"` and other releavnt details `"author"` etc.
- remove any of the defaults you're not using (normally `"keywords"`)
- for private repo you can set `"license"` to `"UNLICENSED"` (i.e. there is not license to use this software unless you are the copyright owner!)

### 3. add core dependencies - [react](https://facebook.github.io/react/) & [react router](https://github.com/ReactTraining/react-router)
```
$ npm install --save react react-addons-css-transition-group react-dom react-router
```

- we're installing the react core as well as react-router which we typically use on every project
- also installing the [css transitions plugin for react](https://facebook.github.io/react/docs/animation.html).
  - For more advanced animation might want to install [`react-addons-transition-group`]((https://facebook.github.io/react/docs/animation.html)) additionally or instead.

### 4. add core dependency - [redux](http://redux.js.org/)
```
$ npm install --save redux react-redux
```
- optionally ignore this if you don't want to use redux!

### 5. add core dependency - [webpack](https://webpack.js.org)
```
npm install --save-dev webpack
```
- we'll be configuring this in a moment! See: [webpack](#webpack)

## add babel and config

- [babel.js](https://babeljs.io/) is a compiler for javascript that lets us write using newer ES6 syntax that isn't fully supported in browsers currently. It compiles our _rad future code_ to regular old js that can run in current browsers.
- We are using a fairly simple set of babel _presets_ to start with but there are many more advanced presets or plugins we can add as new features are required
 - Could possibly take a look at using the [_Create React App_ preset](https://github.com/facebookincubator/create-react-app/tree/master/packages/babel-preset-react-app) for feature configuration in future?

### 1. install babel and dependancies - [babel.js](https://babeljs.io/)
```
$ npm install --save-dev babel-core babel-preset-react babel-preset-es2015 babel-loader
```
- we're using both [`babel-preset-es2015`](https://babeljs.io/docs/plugins/preset-es2015/) and [`babel-preset-react`](https://babeljs.io/docs/plugins/preset-react/) to load a selection of other presets and plugins which allow babel to fully support react and stable ES6 features.
- `babel-loader` is used by webpack to process js with babel  ([see below](#webpack) for full webpack setup)

### 2. add babel config to package.json

- add the following to the bottom of package.json
- can add any preset overrides or other setup here as well


```
"babel": {
    "presets": [
        [ "es2015", { "modules": false } ],
        "react"
    ]
}
```

---
**Why is "modules" set to false?**

The _modules_ option, if set to true (the default), will:
>Enable transformation of ES6 module syntax to another module type.
>(_[babeljs.io/docs/plugins/preset-es2015/](https://babeljs.io/docs/plugins/preset-es2015/)_)

However, we're using webpack 2 which reads import statements `import { thinger } from './module';` without them needing to be transpiled.
It uses the knowledge that ES6 imports are _static_ (you can't make imports as part of a conditional statement) to allow for _tree shaking_; automatically excluding modules which are never imported anywhere.

Tree shaking is great to have so we ask babel to leave import statements alone! (they are all transpiled away by webpack anyway when it concatenates our scripts).

- this is recommended as an approach in the [webpack docs](https://webpack.js.org/guides/migrating/#code-splitting-with-es2015) and [webpack 2 announcement](https://medium.com/webpack/webpack-2-and-beyond-40520af9067f#.fzstj3a8s)
- for a more detailed writeup on tree shaking and this specific config tweak [read this article](https://medium.freecodecamp.com/tree-shaking-es6-modules-in-webpack-2-1add6672f31b#.1vmyqgm1i)!

---

## add eslint and config

- [eslint](http://eslint.org/) is a highly configurable javascript _linter_ which allows us to check our Javascript meets a consistent style and contains none of the errors that we're checking for.
- We're using [Airbnb's Javascript styleguide](https://github.com/airbnb/javascript) and the associated [elint preset](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) in this document, however there are many presets available and a full list of configurable rules on the [eslint site](http://eslint.org/)

### 1. install eslint and dependancies - [eslint](http://eslint.org/)
```
$ npm install --save-dev eslint-config-airbnb eslint eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react babel-eslint eslint-loader eslint-import-resolver-webpack
```
- The additional `eslint plugin`s we install are all dependancies of the  [elint airbnb eslint config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb).
- `eslint-loader` is used by webpack (see below)
- `eslint-import-resolver-webpack` makes eslint aware of the configuration we specify in our webpack `resolve` object.
	- Basically it means that we can set an alias in Webpack like:
	`resolve: { alias: { Public: path.resolve(__dirname, 'public'), },},`  and that eslint will be aware of those aliases.
	- so when we do `import favicon from 'Public/root/favicon.ico';` in any of our files, eslint will properly resolve it and not throw an error.
- [`babel-eslint`](https://github.com/babel/babel-eslint) allows eslint to use babel as a parser for our js files
  - **not sure if we're doing anything that warrants this at the moment. It supports es6 syntax by default so is potentially unneeded...**

### 2. add eslint config to package.json
- add the following to the bottom of package.json
- optionally add overwrites or new rules here - for example this would overwrite the default indent size (airbnb use 2). We could add other overwrites from the [eslint site](http://eslint.org/) in this block too.
```
"eslintConfig": {
  "extends": "airbnb",
  "rules": {},
  "env": {
    "browser": true,
    "node": true
  },
  "settings": {
    "import/resolver": "webpack"
  }
}
```
- the `env` object defines some predetermined globals (things like `document`) so that they don't throw errors
- the `import/resolver` object tells eslint that we want it to use the `eslint-import-resolver-webpack` plugin to work out aliases etc.

## directory structure

- At this point we set up the directory structure for our project. The directory structure is based on the assumption that we're using redux and using an Express server as well as client side rendering.
- Directory structure is based largely on [react-slingshot](https://github.com/coryhouse/react-slingshot/blob/master/docs/FAQ.md#can-you-explain-the-folder-structure) with a few modifications:

#### Explanation of directory structure:

```
.
├── .gitignore                  # ignoring things in git!
├── client                      # any client specific code goes here
│   ├── index.js                # the entry point into the client bundle
│   └── index.ejs               # template for site html
├── package.json                # project details, dependancies, etc.
├── public                      # public assets, images, manifests, favicons etc.
│   └── root                    # files that need to be served, without name changes, from root
│       ├── manifest.json       # used as an example of a static file in our index.ejs template
│       └── robots.txt          # for robots
├── readme.md                   # the project readme
├── server                      # any server specific code goes here
│   └── index.js                # the entry point for the server bundle
├── shared                      # the bulk of project code goes here - shared between client/server
│   ├── actions                 # Flux/Redux actions. List of distinct actions that can occur in the app.
│   ├── components              # React components
│   ├── constants               # application constants including constants for Redux
│   ├── containers              # top-level React components that interact with Redux
│   ├── reducers                # Redux reducers. State is altered here based on actions
│   ├── store                   # Redux store configuration
│   ├── styles                  # SCSS files for site styling
│   └── utils                   # plain JS. Pure logic. No framework specific code here.
└── webpack.config.js           # our combined webpack configuration
```

### 1. make root directories
```
$ mkdir client public server shared
```

### 2. make sub directories
```
$ cd shared
```
```
$ mkdir actions components constants containers reducers store styles utils
```
```
$ cd ../public && mkdir root
```

### 3. initialise indexes and config files
```
$ cd ../ #back to project root
```
```
$ touch client/index.js client/index.ejs public/root/robots.txt public/root/manifest.json server/index.js webpack.config.js
```
```
$ echo '//entry point for client side rendering' > client/index.js
```
```
$ echo $'<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n\n    <link rel="manifest" href="manifest.json">\n</head>\n<body>\n    <div id="app"></div>\n</body>\n</html>' > client/index.ejs
```
```
$ echo '//entry point for server side rendering' > server/index.js
```
```
$ echo $'User-agent: *\nAllow: /' > public/root/robots.txt
```
```
$ echo $'{\n	"name": "Sleepingkiwi React",\n}' > public/root/manifest.json
```

- At this point we have the project structure in place with two blank files for our entry points and a blank webpack config file ready to be filled in the next step!


## webpack base config

- [webpack](https://webpack.js.org) is a module bundler which we use to bundle all of the `import`s that we write in our code into larger _bundles_ which can be used in our deployed application.
- It is highly extensible and we use multiple plugins and _loaders_ to allow it to handle multiple aspects of our application build. Our final webpack config will bundle,minify,lint our javascript and .scss as well as handling image/static asset imports, transpiling our javascript with babel, enabling our use of a dev server and running many other tasks.

---

- our core webpack setup is heavily inspired by the excellent explanations on [The Fine Art of The Webpack 2 Config](https://blog.flennik.com/the-fine-art-of-the-webpack-2-config-dc4d19d7f172#.1ngq7b8iz)
- with many concepts and ideas taken from [Tree-shaking ES6 Modules in webpack 2](https://medium.freecodecamp.com/tree-shaking-es6-modules-in-webpack-2-1add6672f31b#.80kn7kevg), [Building for Production (webpack docs)](https://webpack.js.org/guides/production-build/) and [webpack-hotplate](https://github.com/jake-wies/webpack-hotplate/blob/master/webpack.config.js)
- at this stage we're just setting up the basics, we'll get into some more specifics below!

---

> As our `webpack.config.js` file gets more complex it might be worth splitting out the common and dev/production elements into separate files. Have a look at `webpack-merge`, [Tree-shaking ES6 Modules in webpack 2](https://medium.freecodecamp.com/tree-shaking-es6-modules-in-webpack-2-1add6672f31b#.80kn7kevg) and the associated repo if smaller separate files are your thing...

### 1. Install some webpack dependancies.
```
npm install --save-dev html-webpack-plugin webpack-dev-server script-ext-html-webpack-plugin file-loader url-loader
```
- we have already installed _loaders_ for eslint and babel earlier in this process
- [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) is used to put our bundled webpack files, css, js, etc. into an HTML template (an index file) that we define.
  -  our index template lives at `./client/index.ejs`
- [script-ext-html-webpack-plugin](https://github.com/numical/script-ext-html-webpack-plugin) lets us add async and defer attributes to scripts imported by html-webpack-plugin.
- [webpack-dev-server ](https://github.com/webpack/webpack-dev-server) a simple to set up dev server that serves our bundled client side code and enables live reloading during development.
 -  As part of the [[upgrade] - adding express server](upgrade-adding-express-server) step, and the following [upgrade] steps, webpack-dev-server is removed in favour of using our own express server. If you just want to jump in to the client side dev then you can ignore the [upgrade] steps and keep using webpack-dev-server
- [file-loader](https://webpack.js.org/loaders/file-loader/) - lets us import static assets as URLs in the same way we normally import scripts. Used in our case as a catchall to load assets that aren't explicitly defined elsewhere.
	- `import logo from './logo.png';`
	- `return <img src={logo} alt="Logo" />;`
- [url-loader](https://webpack.js.org/loaders/url-loader/) - Works exactly the same as file loader but if the assets are less than a specified file size they are embedded directly as a data URI. In our base config we've restricted it's use to image files only.

### 2. base config

- download the `webpack.config.js` at the root of this repo and replace the empty `webpack.config.js` at the root of your project!

> Rather than put very long code samples and comments in this readme we have decided to heavily commented the `webpack.config.js` file at the root of this repo. Along with the setup steps and explanations in this document it should give a clear explanation of how each step of the webpack config file was written.

## sass with stylelint and autoprefixer

- [sass](http://sass-lang.com/) is a css preprocessor, we use it primarily for it's support of variables that we can use throughout our css files.
- [stylelint ](https://stylelint.io/) is used to lint our .scss files, enforcing a set of rules when it comes to formatting and writing .scss
	- we are using [airbnb's sass styleguide](https://github.com/airbnb/css/)
		- _currently airbnb do not provide a shared stylelint config to extend_ so we are writing our own implementation using [this .gist as reference](https://gist.github.com/DanielaValero/b3a72b2f3d0c85c1985d5d2d7497f347) which covers most of what we need!
- [autoprefixer](https://github.com/postcss/autoprefixer) allows us to write css without including browser specific prefixes or syntax. It uses a config object (in package.json) to target a specific set of browsers and automatically adds any required prefixes/syntax changes when our css is processed by webpack!
	- autoprefixer is run by the [postcss-loader](https://github.com/postcss/postcss-loader) in webpack

> Our current setup only lints top level files, it doesn't recursively lint through @imports. This is apparently due to limitations in stylelint itself. For our purposes this is fine because we'll primarily be importing .scss files individually in components. However if you need to recursively lint @imports take a look at: [stylelint-webpack-plugin](https://github.com/JaKXz/stylelint-webpack-plugin)

### 1. install stylelint and deps

```
$ npm install stylelint stylelint-config-standard stylelint-scss stylelint-selector-bem-pattern --save-dev
```

- installs stylelint, the default config we will be extending and plugins necessary for the airbnb config.
- [stylelint-config-standard](https://www.npmjs.com/package/stylelint-config-standard) is a basic starting point for stylelint configs which we extend using the airbnb config below.
- [stylelint-scss](https://www.npmjs.com/package/stylelint-scss) extends stylelint to include some more specific rules for the scss syntax
- [stylelint-selector-bem-pattern](https://www.npmjs.com/package/stylelint-selector-bem-pattern) allows us to check class names against BEM naming conventions and patterns we define
- the airbnb config itself is currently brought in with the next step but should eventually be up on npm...

### 2. create local version of airbnb stylelint-config

- copy the `stylelint-config-airbnb_tmp.json` file from the root of this repo into the root of your repo!
	- this is only necessary whilst we wait for airbnb to add a stylelint config to [their official repo](https://github.com/airbnb/css/) for their sass styleguide...
	- our version is based on [this gist](https://gist.github.com/DanielaValero/b3a72b2f3d0c85c1985d5d2d7497f347) but with deprecated rules removed...

### 3. add stylelint config to package.json

```
"stylelint": {
  "extends": [
    "stylelint-config-standard",
    "./stylelint-config-airbnb_tmp.json"
  ]
}
```

- this simply loads our two configs with no custom rules. See [stylelint ](https://stylelint.io/) docs to customise or add new rules.
- we're loading the airbnb config from our local copy so we prefix with `./`

### 4. install postcss-loader and autoprefixer

```
$ npm install postcss-loader postcss-scss autoprefixer --save-dev
```

- installs the postcss loader that webpack will use and also autoprefixer as a separate package. See above for explanations of each.
- [postcss-scss](https://github.com/postcss/postcss-scss) is a _parser_ for postcss that allows it to understand scss syntax.
	- in our webpack config we want `postcss` (through `postcss-loader`) to run `stylelint` on our .scss files _before_ they are converted to css. `stylelint` already understands scss syntax but because we're running through the `postcss-loader` we also need to make sure that the `postcss-loader` understands .scss or we get tons of errors (_for example it doesn't properly understand // comments)
	- we do this by passing `postcss-scss` in the form of `parser: 'postcss-scss',` to the `options{...}` of `postcss-loader`.
	- _search for_ `parser: 'postcss-scss',` _in our webpack config to see this in context_...

### 5. configure autoprefixer

- autoprefixer uses the browserslist key in package.json, so add the following to package.json:

```
"browserslist": [
  "> 0.5%",
  "last 2 versions",
  "Firefox > 30",
  "Opera 12.1",
  "ie >= 8",
  "ios >= 7",
  "android >= 4.4"
]
```
- Firefox 30 is when we can safely start using flexbox so we may as well support the in between versions for now...
- The ie, ios and android values are all fairly broad support. we could probably fall back to `> 0.5%` and `last 2 versions` as our only two rules in some projects...

### 6. install remaining webpack style loaders

```
npm install style-loader css-loader sass-loader node-sass extract-text-webpack-plugin --save-dev
```

- [style-loader](https://github.com/webpack-contrib/style-loader) bundles our css in with our javascript and then injects it in to the head in a `<style>` tag. This is quick and cheap in development, plus allows styles to be hot-reloaded.
	- we use this only in development
- [css-loader](https://github.com/webpack-contrib/css-loader) processes `@import` and `url()` statements in our css so that we can use them like we use `import` or `require` from within our other files
- [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) extracts text from a bundle and puts it into a file! We use it to put all of our bundled css code into a .css file which in turn is included in the head of our HTML template by `html-webpack-plugin`. It allows the css to be cached and means that users don't have to wait for .js to download before the css is injected (.css and .js files can download in parallel)
	- we use this in production, in place of `style-loader`
- [sass-loader](https://github.com/webpack-contrib/sass-loader) converts .scss files to css
- [node-sass](https://github.com/sass/node-sass) is used by sass-loader to work it's magic!

### 7. update webpack config to load styles

- As with basic setup, we've located full notes on this step in our base webpack config (`/webpack.config.js` in this repo)
 - Look through the comments and notes under `/** SCSS to CSS, with autoprefixer and stylelint` in the _loaders_ section of the file
 - also see the comments around `/** [production only] Extract Text Plugin` in the _plugins_ section


## scripts in package.json

### 1. update `scripts` in `package.json`

```
"scripts": {
  "start": "webpack-dev-server --open --env.production=false --env.development --env.platform=web",
  "build": "webpack --env.production --env.platform=web --progress",
  "test": "echo \"For goodness sake. Write Some Tests.\" && exit 1"
},
```

- the scripts above are fairly basic for now.
- `$ npm run start` will:
	- start our dev server on the port specified in `weback.config.js` (9069)
		- For webpack-dev-server our files are bundled in memory so you won't see anything output to the `dist/client` folder that we specify in our config.
	- set the `env.production` variable to `false` so that all of our conditional statements in `weback.config.js` will run their development versions
	- set a `env.development` variable to `true`
		- currently this isn't used in webpack config but could be useful if we end up with multiple non-production states (i.e. staging)
	- set the `env.platform` variable to `web`
		- used by webpack to differentiate between server and client - we haven't covered this yet in these docs!
- `$ npm run build` will:
	- bundle our modules according to the production versions of the code in our `webpack.config.js`
		- you can find the bundled files in the output path specified in `webpack.config.js` (`dist/client`)
	- set the `env.production` variable to `true` so that all of our conditional statements in `weback.config.js` will run their production versions
	- specify a `--progress` argument so that we get details on the build progress written to the command line
	- set the `env.platform` variable to `web`
		- used by webpack to differentiate between server and client - we haven't covered this yet in these docs!
- `$ npm run test` will:
	- throw an error until we write some tests!



## [optional]: example content & bringing in our global styling framework

> this is not essential to the core setup process but explains the process behind the example global styles we have set up in this repo, as well as the example content in our client side entrypoints and components.

- write up in here how we set up test content and things.
	- Example.jsx and styles
	- Global.scss
	- index.jsx




## client side routing and rendering

https://ebaytech.berlin/universal-web-apps-with-react-router-4-15002bb30ccb#.j7jefiv31



## redux and the store



## asynchronous requests with thunks and universal fetch


---

> If you only follow the instructions up to this point you should have a fully functional react app that renders entirely on the client side. The steps below introduce server side rendering into the mix!

---


## [upgrade] - adding express server

> [express.js](http://expressjs.com/) is a fairly simple server framework that runs on node, we use it to serve our application although we defer routing to react-router.
> Our goal is to run our react/js code in a universal way that will work on the server as well as on the client side


## [upgrade] - webpack-dev-middleware and live reloads on express for development


## [upgrade] - webpack-hot-middleware and enabling HMR on server for development


## [upgrade] - rendering from the server



## [upgrade] - handling async on the server



## [upgrade] - handling forms universally


---


## browser support and polyfills

#### polyfilling Javascript

- babel does a good job of converting ES6 into valid ES5 but some (older) browsers still need a hand supporting the full ES5 syntax or features like promises.
- We could use [Babel Polyfill](https://babeljs.io/docs/usage/polyfill/)  to polyfill _all_ of the features supported by Babel but it's file size is ridiculous considering on most projects a lot of the functionality will be unused.
- Instead it's probably worth looking at [Core JS](https://github.com/zloirock/core-js) _(the polyfill library used by babel polyfill)_ directly and just bringing in the parts that you need for the features you're using and the browsers you hope to support!
 - see also [core-js-webpack-plugin](https://www.npmjs.com/package/core-js-webpack-plugin) to selectively include polyfills in webpack ([implementation example](https://github.com/mozilla/distribution-viewer/pull/130/commits/e50db4cdc010986373dbc4514ade37291e63e6d9))


## [optional]: deferred font loading with fallback fonts

> another non-essential step. Gives an example of some utility javascript that allows us to show fallback fonts whilst our @font-face fonts are being downloaded...

#### ❗️ _todo_ - bring in `FontFaceOnload` to handle font loading


## unit testing

#### ❗️ _todo_

- really should have some of these guys at some point...
- use [jest](https://facebook.github.io/jest/) for testing

## todos

- **finish write-ups for all express/server side elements**
- [**unit tests**](#unit-testing)
- write up all [optional] steps
