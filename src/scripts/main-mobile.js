requirejs.config({
   paths: {
   	 jquery: 'lib/jquery/jquery.min',
   	 domReady: 'modules/helpers/domready',
     mobile: 'modules/sections/mobile',
     slideout: 'vendors/slideout.min',
     fastclick: 'vendors/fastclick.min'
  }
});

require([
	'!domReady',
	'jquery',
	'mobile',
	'fastclick'
	], function(domReady, $, mobile, FastClick) {

	$('html').removeClass('no-js').addClass('js');

	mobile.init({
		$container: $('.main__section--mobile')
	});

	FastClick.attach(document.body);
});