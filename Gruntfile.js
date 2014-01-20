module.exports = function(grunt) {
  var covDirectory = "coverage";
  var srcFiles = ["cbor.js"];
  var testFile = "test.js";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    coveralls: {
      all: {
        src: covDirectory + "/lcov.info"
      }
    },
    jshint: {
      options: {
        "camelcase": true,
        "eqeqeq": true,
        "eqnull": true,
        "forin": true,
        "freeze": true,
        "immed": true,
        "latedef": true,
        "newcap": true,
        "noarg": true,
        "noempty": true,
        "nonew": true,
        "quotmark": "double",
        "strict": true,
        "trailing": true,
        "unused": true
      },
      all: srcFiles
    },
    nodeunit: {
      all: [testFile]
    },
    shell: {
      istanbul: {
        command: "istanbul cover -x " + testFile + " nodeunit " + testFile
      },
      sleep_workaround: {
        command: "sleep 15"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.loadNpmTasks("grunt-coveralls");
  grunt.loadNpmTasks("grunt-shell");

  grunt.registerTask("default", ["test"]);
  grunt.registerTask("test", ["nodeunit", "jshint"]);
  grunt.registerTask("ci", ["test", "shell:istanbul", "coveralls", "shell:sleep_workaround"]);
};
