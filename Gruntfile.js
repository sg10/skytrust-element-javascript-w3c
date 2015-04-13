'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        clean: {
            files: ['dist']
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: 'dist/skytrust.js'
            },
        },
        // does not work since PhantomJS does not support Promises yet
        qunit: {
            files: ['test/**/*.html']
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            app: {
                options: {
                    jshintrc: 'app/.jshintrc'
                },
                src: ['app/**/*.js']
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/**/*.js']
            },
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            app: {
                files: '<%= jshint.app.src %>',
                tasks: ['jshint:app', 'qunit']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'qunit']
            },
        },
        requirejs: {
            compile: {
                options: {
                    name: 'skytrust',
                    mainConfigFile: 'app/skytrust.js',
                    out: 'dist/skytrust.js',
                    optimize: 'uglify2',
                    findNestedDependencies: true,
                    //include : ["w3ccrypto/load-w3c"],
                    exclude : ["jQuery", "skytrust-config"]
                }
/*
                options: {
                    name: 'skytrust',
                    findNestedDependencies: true,
                    baseUrl: 'app/',
                    optimize: 'none',
                    mainConfigFile: 'app/skytrust.js',
                    //'include': ['first'],
                    out: 'dist/skytrust.js',
                    onModuleBundleComplete: function (data) {
                        var fs = require('fs'),
                        amdclean = require('amdclean'),
                        outputFile = data.path;

                        fs.writeFileSync(outputFile, amdclean.clean({
                            'filePath': outputFile
                        }));
                    }
*/
            }
        },
        copy: {
            dist: {
                files: [
                    // includes files within path
                    {expand: false, src: ['app/skytrust-config.js'], dest: 'dist/skytrust-config.js', filter: 'isFile'},
                ],
            },
            dropbox: {
                files: [
                    {expand: false, src: ['app/skytrust-iframe.html'], dest: 'D:\\Cloud Storage\\Dropbox\\Apps\\KISSr\\skytrust-iframe.kissr.com\\skytrust-iframe.html', filter: 'isFile'},
                    {expand: false, src: ['dist/skytrust.js'], dest: 'D:\\Cloud Storage\\Dropbox\\Apps\\KISSr\\skytrust-iframe.kissr.com\\skytrust.js', filter: 'isFile'},
                    {expand: false, src: ['app/skytrust-config.js'], dest: 'D:\\Cloud Storage\\Dropbox\\Apps\\KISSr\\skytrust-iframe.kissr.com\\skytrust-config.js', filter: 'isFile'},
                ],
            }
        },
        connect: {
            development: {
                options: {
                    keepalive: true,
                }
            },
            production: {
                options: {
                    keepalive: true,
                    port: 8000,
                    middleware: function(connect, options) {
                        return [
                            // rewrite requirejs to the compiled version
                            function(req, res, next) {
                                if (req.url === '/bower_components/requirejs/require.js') {
                                    req.url = '/dist/require.min.js';
                                }
                                next();
                            },
                            connect.static(options.base),

                        ];
                    }
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');


    // Default task
    grunt.registerTask('default', ['jshint', /*'qunit', */'clean', 'requirejs', 'concat', 'copy:dist']);
    grunt.registerTask('buildtest', ['clean', 'requirejs', 'concat', 'copy:dropbox']);
    grunt.registerTask('preview', ['connect:development']);
    grunt.registerTask('preview-live', ['default', 'connect:production']);

};
