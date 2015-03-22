module.exports = function(grunt) {
    /* String.prototype.endsWith polyfill */
    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function(searchString, position) {
            var subjectString = this.toString();
            if (position === undefined || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        };
    }
    grunt.initConfig({
        babel: {
            options: {
                experimental: true,
                compact: false,
            },
            scripts: {
                files: [{
                    expand: true,
                    cwd: "src/",
                    dest: "build/",
                    ext: ".c.js",
                    extDot: "last",
                    src: ["**/*.js"],
                    filter: function(path) {
                        return !path.endsWith(".m.js");
                    }
                }]
            },
            modules: {
                options: {
                    modules: "system"
                },
                files: [{
                    expand: true,
                    cwd: "src/",
                    dest: "build/",
                    ext: ".c.js",
                    extDot: "last",
                    src: ["**/*.m.js"]
                }]
            }
        },
        uglify: {
            minify: {
                options: {
                    beautify: false,
                    sequences: true,
                    properties: true,
                    dead_code: true,
                    drop_debugger: true,
                    conditionals: true,
                    comparisons: true,
                    evaluate: true,
                    booleans: true,
                    loops: true,
                    unused: true,
                    hoist_funs: true,
                    if_return: true,
                    join_vars: true,
                    cascade: true,
                    negate_iife: true,
                },
                files: [{
                    expand: true,
                    cwd: "build/",
                    dest: "build/",
                    ext: ".min.js",
                    extDot: "last",
                    src: ["**/*.c.js"]
                }]
            },
            beautify: {
                options: {
                    beautify: true,
                    width: 200
                },
                files: [{
                    expand: true,
                    cwd: "build/",
                    dest: "build/",
                    src: ["**/*.c.js"]
                }]
            }
        },
        lessc: {
            compile: {
                files: [{
                    expand: true,
                    cwd: "src/",
                    dest: "build/",
                    ext: ".css",
                    extDot: "last",
                    src: ["**/*.less"]
                }]
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-less");
    //grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-babel");
    grunt.registerTask("default", ["babel", "uglify", "lessc"]);
};