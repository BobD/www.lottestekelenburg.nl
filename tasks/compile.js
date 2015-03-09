module.exports = function(grunt) {
	var _ = require("underscore");
	var Handlebars = require('Handlebars');
	var path  = require('path');								// http://nodejs.org/api/path.html#path_path
	var cwdPath = 'src';
	var buildPath = 'build';

	grunt.registerTask('compile', 'Compiles the Handlebar templates into HTML', function() {
		var pages = grunt.file.expand('src/html/*.html');
		var partials = grunt.file.expand({cwd: 'src/html/templates/'}, '**/*.hbs');
		var data = grunt.option('data');
		var partialName, partialHTML, dir, dir;

		_.each(partials, function(file){
			dir = path.dirname(file);

			if(dir == '.'){
				dir = '';
			}else{
				dir += '/';
			}

			partialName = path.basename(file, '.hbs');
			partialHTML = grunt.file.read('src/html/templates/' + file);

			Handlebars.registerPartial(dir + partialName, partialHTML);
		});

		_.each(pages, function(file){
			compilePage(file);
		});


		function compilePage(file){
			var html = grunt.file.read(file);
			var name = path.basename(file, '.html');
			var template = Handlebars.compile(html);
			var html = template(data);

			grunt.file.write(buildPath + '/' + name + '.html', html);
		}

	});

}