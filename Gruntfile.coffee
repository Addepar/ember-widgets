# Gruntfile courtesy of trek (https://github.com/trek/)
# ember-todos-with-build-tools-tests-and-other-modern-conveniences
module.exports = (grunt) ->

  # env could be 'dev' or 'prod'
  env = grunt.option("env") or "dev"

  grunt.initConfig
    clean:
      target: ['build', 'dist' , 'gh_pages']

    karma:
      continuous:  # continuous integration mode
        configFile: 'karma.conf.js'
        singleRun: true
      unit:
        configFile: 'karma.conf.js'
        singleRun: true
        exclude: ['build/src/ember_widgets.js', 'tests/integration/*.js'],
      integration:
        configFile: 'karma.conf.js'
        singleRun: true
        exclude: ['build/src/ember_widgets.js', 'tests/unit/*.js'],
      default:
        configFile: 'karma.conf.js'
        singleRun: false

    uglify:
      "dist/ember-widgets.min.js": "dist/ember-widgets.js"

    # https://github.com/yatskevich/grunt-bower-task
    bower:
      install:
        options:
          targetDir: 'dependencies'
          layout: 'byComponent'
          install: true
          verbose: true
          cleanTargetDir: false
          cleanBowerDir: true
          bowerOptions: {}

    coffee:
      srcs:
        options:
          bare: true
        expand: true
        cwd: "src/"
        src: [ "**/*.coffee" ]
        dest: "build/src/"
        ext: ".js"
      app:
        options:
          bare: true
        expand: true
        cwd: "app/"
        src: [ "**/*.coffee" ]
        dest: "build/app/"
        ext: ".js"
      tests:
        expand: true
        cwd: "tests/"
        src: ["**/*.coffee" ]
        dest: "tests/"
        ext: ".js"

    emberTemplates:
      options:
        templateName: (sourceFile) ->
          sourceFile.replace(/src\/templates\//, '')
                    .replace(/app\/templates\//, '')
      'build/src/templates.js':   ["src/templates/**/*.hbs"]
      'build/app/templates.js':  ["app/templates/**/*.hbs"]

    neuter:
      options:
        includeSourceURL: env is "dev"
      "dist/ember-widgets.js":  "build/src/ember_widgets.js"
      "gh_pages/app.js":        "build/app/app.js"

    less:
      development:
        options:
          yuicompress: env isnt "dev"
        files:
          "dist/ember-widgets.css": "src/css/ember-widgets.less"
      app:
        options:
          yuicompress: env isnt "dev"
        files:
          "gh_pages/css/app.css": "app/assets/css/app.less"

    # Copy build/app/assets/css into gh_pages/asset and other assets from app
    copy:
      gh_pages:
        files: [
          {src: ['dist/ember-widgets.css'], dest: 'gh_pages/css/ember-widgets.css'},
          {src: ['app/index.html'], dest: 'gh_pages/index.html'},
          {expand: true, flatten: true, cwd: 'dependencies/', src: ['**/*.js'], dest: 'gh_pages/lib'},
          {expand: true, flatten: true, cwd: 'dependencies/', src: ['**/*.css'], dest: 'gh_pages/css'},
          {expand: true, cwd: 'dependencies/font-awesome/fonts/', src: ['**'], dest: 'gh_pages/fonts'},
          {expand: true, cwd: 'app/assets/font/', src: ['**'], dest: 'gh_pages/fonts'},
          {expand: true, cwd: 'app/assets/img/', src: ['**'],  dest: 'gh_pages/img'},
          {expand: true, cwd: 'src/img/', src: ['**'], dest: 'gh_pages/img'}
          {expand: true, cwd: 'src/img/', src: ['**'], dest: 'dist/img'}
        ]

    ###
      Watch files for changes.

      Changes in dependencies/ember.js or src javascript
      will trigger the neuter task.

      Changes to any templates will trigger the emberTemplates
      task (which writes a new compiled file into dependencies/)
      and then neuter all the files again.
    ###
    watch:
      grunt:
        files: [ "Gruntfile.coffee" ]
        tasks: [ "default" ]
      src:
        files: [ "src/**/*.coffee"]
        tasks: [ "coffee:srcs", "neuter" ]
      test:
        files: [ "tests/**/*.coffee"]
        tasks: [ "coffee:tests", "neuter" ]
      src_handlebars:
        files: [ "src/**/*.hbs" ]
        tasks: [ "emberTemplates", "neuter" ]
      app:
        files: [ "app/**/*.coffee", "dependencies/**/*.js" ]
        tasks: [ "coffee:app", "neuter" ]
      app_handlebars:
        files: [ "app/**/*.hbs"]
        tasks: [ "emberTemplates", "neuter" ]
      less:
        files: [ "src/**/*.less", "src/**/*.css",
                 "dependencies/**/*.less", "dependencies/**/*.css",
                 "app/assets/**/*.less", "app/assets/**/*.css" ]
        tasks: ["less", "copy"]
      copy:
        files: [ "app/index.html" ]
        tasks: [ "copy" ]
      bower:
        files: [ 'bower.json']
        tasks: [ 'bower']
      uglify:
        files: [ 'dist/ember-widgets.js' ]
        tasks: [ 'uglify' ]

    ###
      Runs all .html files found in the test/ directory through PhantomJS.
      Prints the report in your terminal.
    ###
    qunit:
      all: [ "tests/**/*.html" ]

    ###
      Reads the projects .jshintrc file and applies coding
      standards. Doesn't lint the dependencies or test
      support files.
    ###
    jshint:
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!dependencies/*.*', '!test/support/*.*']
      options:
        jshintrc: ".jshintrc"

    ###
      Find all the <whatever>_test.js files in the test folder.
      These will get loaded via script tags when the task is run.
      This gets run as part of the larger 'test' task registered
      below.
    ###
    build_test_runner_file:
      all: [ "tests/**/*_test.js" ]

  grunt.loadNpmTasks "grunt-bower-task"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-qunit"
  grunt.loadNpmTasks "grunt-neuter"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-ember-templates"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-less"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-karma"
  ###
    A task to build the test runner html file that get place in
    /test so it will be picked up by the qunit task. Will
    place a single <script> tag into the body for every file passed to
    its coniguration above in the grunt.initConfig above.
  ###
  grunt.registerMultiTask "build_test_runner_file", "Creates a test runner file.", ->
    tmpl = grunt.file.read("tests/support/runner.html.tmpl")
    renderingContext = data:
      files: @filesSrc.map (fileSrc) -> fileSrc.replace "tests/", ""
    grunt.file.write "tests/runner.html", grunt.template.process(tmpl, renderingContext)

  grunt.registerTask "build_srcs", [ "coffee:srcs", "emberTemplates", "neuter" ]
  grunt.registerTask "build_app", [ "coffee:app", "emberTemplates", "neuter" ]
  grunt.registerTask "build_tests", [ "coffee:tests", "emberTemplates", "neuter" ]
  if env is "dev"
    grunt.registerTask "default", [ "clean", "bower", "build_srcs", "build_app", "build_tests", "less", "copy", "uglify", "watch" ]
    # build: same as default but no bower
    grunt.registerTask "build", [ "clean", "build_srcs", "build_app", "build_tests", "less", "copy", "uglify", "watch" ]
  else
    grunt.registerTask "default", [ "bower", "less", "build_srcs", "uglify"]
