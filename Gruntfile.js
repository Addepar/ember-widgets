module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-release-it');

  grunt.initConfig({
    'release-it': {
      options: {
        'pkgFiles': ['package.json', 'bower.json'],
        'commitMessage': 'Release %s',
        'tagName': 'v%s',
        'tagAnnotation': 'Release %s',
        'increment': 'patch',
        'buildCommand': 'ember build --environment="production"',
        'distRepo': '-b gh-pages git@github.com:addepar/ember-widgets-addon',
        'distStageDir': '.stage',
        'distBase': 'dist',
        'distFiles': ['**/*'],
        'publish': false
      }
    }
  });
}
