define(['jquery', 'underscore'], function($, _){

	var module = {

		init: function(options){
			module.$container = options.$container;

			module.$container.on('click', '#hamburger.is-open', function(e){
				module.hide();
			});

			module.$container.on('click', '#hamburger.is-closed', function(e){
				module.show();
			});

			module.$container.on('click', 'li', function(e){
				module.hide();
			});

		},

		update: function(route){
			var path = window.location.hash;
			module.$container.find('.active').toggleClass('active', false);
			module.$container.find('a[href="' + path + '"]').parent().toggleClass('active', true);
		},

		show: function(){
			$('#hamburger').removeClass('is-closed').addClass('is-open');
			module.$container.toggleClass('show', true);
		},

		hide: function(){
			$('#hamburger').removeClass('is-open').addClass('is-closed');
			module.$container.toggleClass('show', false);
		}

	}

	return module;
});