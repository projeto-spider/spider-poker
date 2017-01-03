exports.config = {
  // See http://brunch.io/#documentation for docs.
  files: {
    javascripts: {
      joinTo: "js/app.js"

      // To use a separate vendor.js bundle, specify two files path
      // http://brunch.io/docs/config#-files-
      // joinTo: {
      //  "js/app.js": /^(web\/static\/js)/,
      //  "js/vendor.js": /^(web\/static\/vendor)|(deps)/
      // }
      //
      // To change the order of concatenation of files, explicitly mention here
      // order: {
      //   before: [
      //     "web/static/vendor/js/jquery-2.1.1.js",
      //     "web/static/vendor/js/bootstrap.min.js"
      //   ]
      // }
    },
    stylesheets: {
      joinTo: "css/app.css",
      order: {
        before: [
          "node_modules/font-awesome/css/font-awesome.min.css",
          "node_modules/bootstrap/dist/css/bootstrap.min.css",
          "node_modules/admin-lte/dist/css/AdminLTE.min.css",
          "node_modules/admin-lte/dist/css/skins/skin-purple-light.min.css"
        ],
        after: ["web/static/css/app.css"] // concat app.css last
      }
    },
    templates: {
      joinTo: "js/app.js"
    }
  },

  conventions: {
    // This option sets where we should place non-css and non-js assets in.
    // By default, we set this to "/web/static/assets". Files in this directory
    // will be copied to `paths.public`, which is "priv/static" by default.
    assets: /^(web\/static\/assets)/
  },

  // Phoenix paths configuration
  paths: {
    // Dependencies and current project directories to watch
    watched: [
      "web/static",
      "test/static"
    ],

    // Where to compile files to
    public: "priv/static"
  },

  // Configure your plugins
  plugins: {
    babel: {
      presets: ["es2015"],
      // Do not use ES6 compiler in vendor code
      ignore: [/web\/static\/vendor/]
    },
    afterBrunch: [
      [
        'mkdir priv/static/fonts/ -p',
        'cp web/static/fonts/* priv/static/fonts/'
      ].join(' && ')
    ]
  },

  modules: {
    autoRequire: {
      "js/app.js": ["web/static/js/app"]
    }
  },

  npm: {
    styles: {
      'font-awesome': ['css/font-awesome.min.css'],
      bootstrap: ['dist/css/bootstrap.min.css'],
      'admin-lte': [
        'dist/css/AdminLTE.min.css',
        'dist/css/skins/skin-purple-light.min.css'
      ],
      nprogress: ['nprogress.css'],
    },
  },
};
