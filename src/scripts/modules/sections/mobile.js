define(['jquery', 'slideout'], function($, Slideout){

	var module = {

		init: function(options){

			module.$container = options.$container;
			// https://github.com/mango/slideout#installation
			var slideout = new Slideout({
			    'panel': module.$container.find('.slideout__panel')[0],
			    'menu': module.$container.find('.slideout__menu')[0],
			    'padding': 256,
			    'tolerance': 70,
			    'side': 'right'
			});

			module.$container.find('.slideout__toggle').click(function(e){
				e.preventDefault();

				slideout.toggle();
			})
		},

	}

	return module;
});