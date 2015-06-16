module.exports = function(grunt) {
	var endPath = '/Applications/AMPPS/www/lottestekelenburg/'

	grunt.registerTask('distribute', 'Copy the production files to the proper location for further testing', function() {
		grunt.config('copy.distribute.files', [
			{src: 'build/scripts/require.js', dest: endPath + '/scripts/require.js'},
			{src: 'build/scripts/main.min.js', dest: endPath + '/scripts/main.min.js'},
			{src: 'build/scripts/main-mobile.min.js', dest: endPath + '/scripts/main-mobile.min.js'},
			{src: 'build/scripts/director.min.js', dest: endPath + '/scripts/director.min.js'},
			{src: 'build/scripts/lib/jquery/jquery.min.map', dest: endPath + '/scripts/jquery.min.map'},
			{expand: true, cwd: 'dist/scripts/vendors/', src: ['**/*.*'], dest: endPath + '/scripts/vendors/', filter: 'isFile'},
			{expand: true, cwd: 'dist/css/', src: ['**/*.*'], dest: endPath + '/css', filter: 'isFile'},
		]);
		grunt.task.run(['default', 'requirejs', 'copy:distribute']);
	});

}