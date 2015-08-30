requirejs.config({
   paths: {
   	 jquery: 'lib/jquery/jquery.min',
   	 domReady: 'modules/helpers/domready',
   	 text: 'modules/helpers/text',
   	 filter: 'modules/helpers/filter',
     underscore: 'lib/underscore/underscore-min',
     routes: 'modules/routes',
     archive: 'modules/sections/archive',
     content: 'modules/sections/content',
     information: 'modules/sections/information',
     slideout: 'vendors/slideout.min',
     fastclick: 'vendors/fastclick.min'
  }
});

require([
	'domReady',
	'text!albums.json',
	'jquery',
	'routes',
	'archive',
	'information',
	'content'
	], function(domReady, albums, $, routes, archive, information, content) {

		domReady(function () {
			var albums = (albums) ? JSON.parse(albums) : {};

			$('html').removeClass('no-js').addClass('js');

			archive.init({
				$container: $('.main__section--archive')
			});

			content.init({
				$container: $('.main__section--content'),
				albums: albums
			});

			information.init({
				$container: $('.main__section--information')
			});

			routes.init({});

			// FastClick.attach(document.body);
	  });


});