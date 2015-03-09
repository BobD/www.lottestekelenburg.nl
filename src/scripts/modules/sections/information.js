define(['jquery', 'underscore', 'filter'], function($, _, Filter) {

	var module = {
		init: function(options){
			module.$container = options.$container;

			module.nav = new Filter({
				$filter: module.$container.find('.filter__list'),
				onFilter: function(config){
					module.$container.toggleClass('hide');
				}
			});

			module.$container.find('.text__close').on('click', function(e){
				e.stopPropagation();
				module.nav.trigger();
			});

			module.$container.find('.text').on('click', function(){
				if(module.$container.hasClass('hide')){
					module.nav.trigger();
				}
			});
		},

		hide: function(){
			if(!module.$container.hasClass('hide')){
				module.nav.trigger();
			}
		},

		show: function(){
			module.$container.toggleClass('hide', false);
		}
	}

	return module;
});