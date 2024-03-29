module.exports = function (grunt) {
    "use strict";
    // Project configuration.
    grunt.initConfig({

        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            basePath: '../',
            srcPath: './src/',
            deployPath: './deploy/'
        },

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ',



        // Task configuration.
        qunit: {
            options:{
                timeout: 10000
            },
            all:{
                options:
                {
                    urls:[
                        "http://localhost:8000/test/tests.html"
                    ]
                }
            }
        },
        connect: {
          server: {
            options: {
              port: 8000,
              base: '.'
            }
          }
        },

        jshint: {
            files: {
                src: ['gruntfile.js', 'src/*.js']
            }
        },


        concat: {
            options: {
                stripBanners: true
            },
            dist: {
                src: ['<%= meta.srcPath %>CookieMgr.js',
                    '<%= meta.srcPath %>TestTracker.js',
                    '<%= meta.srcPath %>GemiusTracker.js',
                    '<%= meta.srcPath %>PiwikProTracker.js',
                    '<%= meta.srcPath %>MotomoTracker.js',
                    '<%= meta.srcPath %>NetMinersTracker.js',
                    '<%= meta.srcPath %>GoogleAnalyticsTracker.js',
                    '<%= meta.srcPath %>SiteImproveTracker.js',
                    '<%= meta.srcPath %>ReferrerHandler.js',
                    '<%= meta.srcPath %>getElementsByClassName.polyfill.js',
                    '<%= meta.srcPath %>CookiePrompter.js'
                ],
                dest: '<%= meta.deployPath %>CookiePrompter.js'
            }
        },
        uglify: {
            build: {
                src: '<%= meta.deployPath %>CookiePrompter.js',
                dest: '<%= meta.deployPath %>CookiePrompter.min.js'
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');


    // Default task
    grunt.registerTask('default', ['jshint', 'connect','qunit', 'concat', 'uglify']);
    grunt.registerTask('test', ['connect','qunit']);
};