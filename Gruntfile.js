module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      my_target: {
        files: {
          'build/mini5-engine.min.js': [
            'src/gameObject.js',
            'src/scene.js',
            'src/engine.js',
            'node_modules/mainloop.js/build/mainloop.min.js',
          ]
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify-es');

  // Task(s).
  grunt.registerTask('default', 'Test Grunt Task', function() {
    grunt.log.write('Test Function, Logging to Console...').ok();
  });
  grunt.registerTask('build', ['uglify']);


};