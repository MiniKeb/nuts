module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    // Configure a mochaTest task
    simplemocha: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: "./nuts-api-2/test/*_spec.js"
      }
    },

    watch: {
      files: "./nuts-api-2/**/*.js",
      tasks: ['test']
    }
  });

  grunt.registerTask('test', 'simplemocha');
};