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
     mobile: 'modules/sections/mobile',
     slideout: 'vendors/slideout.min',
     fastclick: 'vendors/fastclick.min'
  }
});

require([
	'!domReady',
	'text!albums.json',
	'jquery',
	'routes',
	'archive',
	'information',
	'content',
	'mobile',
	'fastclick'
	], function(domReady, albums, $, routes, archive, information, content, mobile, FastClick) {
	
	var albums = JSON.parse(albums);

	$('html').removeClass('no-js').addClass('js');

	if($('.main').hasClass('mobile')){
		mobile.init({
			$container: $('.main__section--mobile')
		});
	}else{
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
	}

	FastClick.attach(document.body);
});