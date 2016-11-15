module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-broccoli');

  // Project configuration.
  grunt.initConfig({
    broccoli: {
      dist: {
        dest: 'dist',
        config: 'packaging/Brocfile.js'
      }
    }
  });

  grunt.registerTask("dist", ["broccoli:dist:build"]);
  grunt.registerTask("default", ["dist"]);
};

