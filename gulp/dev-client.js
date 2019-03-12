var gulp = require("gulp"),
    gulpsync = require("gulp-sync")(gulp),
    gutil = require("gulp-util"),
    webpack = require("webpack"),
    webserver = require("gulp-webserver"),
    runSequence = require("run-sequence"),
    webpackStream = require("webpack-stream");

module.exports = function(ENV) {
    var WEBPACK_CONFIG = require("../webpack.config.js");
    var DEV_PORT = "8888";
    var BUILD_DIR = "./sandbox"; //WEBPACK_CONFIG.BUILD_DIR;

    var paths = {
        jsSources: "src/**/*",
        sandboxSources: "sandbox/*",
    };

    WEBPACK_CONFIG.watch = true;

    /**
     * Serve our files from /build
     */

    gulp.task("dev.server", function() {
        console.log("IN dev.server");
        return gulp.src([BUILD_DIR]).pipe(
            webserver({
                host: "0.0.0.0",
                port: DEV_PORT,
                fallback: "index.html",
            })
        );
    });

    //
    ///*** DEVELOPMENT BUILD + WATCH ***/
    //

    // TODO try changing this to use gulp.src([WEBPACK_CONFIG.entry]).pipe( ... webpack stuff ..).pipe(gulp.dest(BUILD_DIR))

    //// create a single instance of the compiler to allow caching
    var devCompiler = null;
    gulp.task("webpack:build-dev", function(callback) {
        if (!devCompiler) {
            devCompiler = webpack(WEBPACK_CONFIG);
        }
        // run webpack
        devCompiler.run(function(err, stats) {
            if (err) throw new gutil.PluginError("webpack:build-dev", err);
            gutil.log("[webpack:build-dev]", stats.toString({ colors: true }));
            callback();
        });
    });

    /*** HELPER FUNCTIONS ***/

    function sync() {
        return gulpsync.sync([].slice.call(arguments));
    }

    /**
     * 1. Builds js and css
     * 2. Watches for changes in /src to build js and css
     * 3. Starts local node server to serve frontend assets
     */
    gulp.task("dev", sync("webpack:build-dev", "dev.server"), function() {
        gulp.watch([paths.jsSources, paths.sandboxSources], ["webpack:build-dev"]);
    });
};
