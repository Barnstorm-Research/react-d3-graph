var ENV = process.env.ENV || "dev",
    gulp = require("gulp");

require("./gulp/dev-client")(ENV);

gulp.task("default", ["dev"]);
