    //Gruntfile
    module.exports = function(grunt) {

    //Initializing the configuration object
      grunt.initConfig({

        concat: {
          options: {
            sourceMap: true,
            separator: ';',
          },

          js: {
            src: [
              './public/components/jquery/dist/jquery.js',
              './public/components/bootstrap/dist/js/bootstrap.js',
              './public/components/angular/angular.js',
              './public/js/mnbb.js',
              './web_modules/true_wind/true_wind.js'
            ],
            dest: './public/js/core.js'
          },

          css: {
            src: [
              './public/components/bootstrap/dist/css/bootstrap.css'
            ],
            dest: './public/css/core.css'
          }
        }

        /*,



        less{
          //...
        },
        uglify{
          //...
        },
        phpunit{
          //...
        },
        watch{
          //...
        }*/

      });
    grunt.file.copy('./public/components/bootstrap/dist/css/bootstrap.css.map', './public/css/bootstrap.css.map')
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat']);
  };

