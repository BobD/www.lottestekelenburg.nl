define(['jquery', 'underscore', 'filter'], function($, _, Filter) {

	var module = {
		init: function(options){
			module.$container = options.$container;

			module.nav = new Filter({
				$filter: module.$container.find('.filter__list')
			});

			module.$container.find('.archive__list').find('a').bind('mouseenter', function(e){
				module.$container.toggleClass('hide', false);
			});
		},

		filter: function(filters, article){
			var $article;

			module.$container.find('.archive__list').attr('data-filters', filters);
			module.$container.find('.archive__list__item.active').removeClass('active');
			module.$container.toggleClass('hide', false);

			if(article === undefined){	
				$article = module.$container.find('.archive__list__item[data-filters="' + filters + '"]').eq(0);
				$article.find('a').trigger('click');
			}else{
				$article = module.$container.find('.archive__list__item__link[href="' + window.location.hash + '"]').parent('.archive__list__item');
			}

			$article.addClass('active');

			module.nav.activate(filters);
		},

		hide: function(){
			module.nav.clear();
			module.$container.toggleClass('hide', true);
		},

		hideQuick: function(){
			module.$container.toggleClass('no-effect', true);
			setTimeout(function(){
				module.$container.toggleClass('no-effect', false);
			}, 500);
			module.$container.toggleClass('hide', true);
		},

		// show: function(id){
		// 	module.$container.toggleClass('hide', false);

		// 	if(id){
		// 		module.$container.find('.archive__list__item.active').removeClass('active');
		// 		var $item = module.$container.find('.archive__list__item__link[href="' + window.location.hash + '"]');
		// 		$item.parent('.archive__list__item').addClass('active');
		// 	}
		// }
	}

	return module;
});