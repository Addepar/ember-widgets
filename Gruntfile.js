module.exports = function (grunt) {
  'use strict';

  var path = require('path');

  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-broccoli');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-release-it');
  grunt.loadNpmTasks('grunt-text-replace');

  // TODO(azirbel): We should register Ember Widgets, with its version, to Ember.Libraries

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n* <%=pkg.name %> v<%=pkg.version%>\n' +
            '* Copyright 2012-<%=grunt.template.today("yyyy")%> Addepar Inc.\n' +
            '* See LICENSE.\n*/',

    broccoli: {
      dist: {
        dest: 'dist',
        config: 'packaging/Brocfile.js'
      }
    },

    replace: {
      global_version: {
        src: ['VERSION'],
        overwrite: true,
        replacements: [{
          from: /.*\..*\..*/,
          to: '<%=pkg.version%>'
        }]
      },
      overview_page: {
        src: ['tests/dummy/app/templates/overview.hbs'],
        overwrite: true,
        replacements: [{
          from: /The current version is .*\..*\..*\./,
          to: "The current version is <%=pkg.version%>."
        }]
      }
    },

    uglify: {
      file: {
        options: {
          preserveComments: false,
          beautify: false,
          mangle: true,
          report: 'min'
        },

        files: {
          './dist/js/ember-widgets.min.js': ['./dist/js/ember-widgets.js']
        }
      }
    },

    // Add a banner to dist files which includes version & year of release
    usebanner: {
      js: {
        options: {
          banner: '<%=banner%>'
        },
        files: {
          src: ['dist/*.js']
        }
      },
      css: {
        options: {
          banner: '<%=banner%>'
        },
        files: {
          src: ['dist/*.css']
        }
      }
    },

    'release-it': {
      options: {
        'pkgFiles': ['package.json', 'bower.json'],
        'commitMessage': 'Release %s',
        'tagName': 'v%s',
        'tagAnnotation': 'Release %s',
        'increment': 'patch',
        'buildCommand': 'grunt dist && ember build --environment="gh-pages"',
        'distRepo': '-b gh-pages git@github.com:Addepar/ember-widgets',
        'distStageDir': '.stage',
        'distBase': 'ember-dist',
        'distFiles': ['**/*'],
        'publish': false
      }
    }
  });

  grunt.registerTask("dist", ["replace", "broccoli:dist:build", "uglify", "usebanner"]);
  grunt.registerTask("default", ["dist"]);
};

