	define(['jquery', 'underscore', 'routes', 'filter'], function($, _, routes, Filter) {

	var albumsFeed = 'http://image.service.viewbook.com/api/users/lotte/albums/';

	var module = {

		init: function(options){
			module.albums = options.albums;
			module.$container = options.$container;
			module.$albums = module.$container.find('.main__section__header__nav .albums');
			module.$images = module.$container.find('.main__section__header__nav .images');
			module.$scrollContainer = module.$container.find('.main__section__body__content');
			module.nav = new Filter({
				$filter: module.$container.find('.filter__list')
			});
			module.current = {};

			// Go to the next album photo
			module.$scrollContainer.on('click', '.photo.active', function(e){
				e.preventDefault();

				module.gotoImage($(this).next());
			});

			// Go to the choosen album photo
			module.$scrollContainer.on('click', '.photo:not(.active)', function(e){
				e.preventDefault();

				module.gotoImage($(this));
			});

			// Return to the first if the active one is the last
			module.$scrollContainer.on('click', '.photo:last-child', function(e){
				if($(this).hasClass('active')){
					e.preventDefault();

					var first = $(this).siblings().first().find('a').attr('href')
					window.location.hash = first;
				}
			});

			// Go to the next article
			module.$scrollContainer.on('click', '.article.active:not(:last-child) .article__header, .article.active:not(:last-child) .article__footer', function(e){
				e.preventDefault();

				module.gotoArticle($(this).parents('.article').next());
			});

			// Go to the choosen article 
			module.$scrollContainer.on('click', '.article:not(.active) .article__header, .article:not(.active) .article__footer', function(e){
				e.preventDefault();

				module.gotoArticle($(this).parents('.article'));
			});


			// Add some key naviation
			$(document).on( 'keydown', function( e ) {
				var $next, $prev;

				// Not partically ideal, mostly because the .article and .photo markup is not similar.
				if(module.current.type == 'article'){
					$next = $('.article.active').find('.article__footer');
					$prev = $('.article.active').prev().find('.article__footer');
				}

				if(module.current.type == 'album'){
					$next = $('.photo.active');
					$prev = $('.photo.active').prev();
				}

			    if (e.keyCode == '38') {
			       	$prev.trigger('click');
			    }else if (e.keyCode == '40') {
			        $next.trigger('click');
			    }
			});
		},

		initArticles: function(){
			module.hideSection('intro');
			module.hideSection('photography');
			module.showSection('articles');
		},

		listArticles: function(filter, article){
			module.initArticles();
			module.$scrollContainer.attr('data-filters', filter);

			if(article){
				module.showArticle(article);
			}else{
				module.scrollTo();
			}

			module.current = {
				type: 'article',
				filter: filter
			}
		},

		showArticle: function(article){
			module.hideAlbums();
			module.$images.empty();
			module.nav.clear();
			module.scrollTo(article);
			module.$container.attr('data-filters', 'archive');
		},

		gotoArticle: function($article){
			var filter = $article.attr('data-filters');
			var album = $article.attr('album');
			var id = $article.attr('id');

			$('body').scrollTop(0);
			window.location.hash = '/' + archiveURL + '/' + filter + '/' + id;
		},

		initIntro: function(){
			module.hideAlbums();
			module.showSection('intro');
			module.hideSection('articles');
			module.hideSection('photography');
			module.$container.removeAttr('data-filters');
		},

		initPhotography: function(){
			module.hideSection('intro');
			module.hideSection('articles');
			module.showSection('photography');
			module.$container.attr('data-filters', 'photography');
		},

		listAlbums: function(filter, album, image){
			var $albumList = module.$albums.find('*[data-filter="' + filter + '"]');

			module.hideAlbums();
			module.initPhotography();
			module.nav.activate(filter);

			$albumList.addClass('show');

			if(!album && filter && module.current.filter != filter){
				var hash= $albumList.find('li').first().find('a').attr('href');
				var split = hash.split('/');
				var filter = split[2];
				var album = split[3];
				var image = split[4];
			}

			if(album && module.current.album != album){
				 module.loadAlbum(filter, album, image);
			}else if(image && module.current.image != image){
				module.showImage(image);
			}

			module.current = {
				type: 'album',
				filter: filter,
				album: album,
				image: image
			}
		},

		hideAlbums: function(){
			module.$albums.find('*[data-filter]').removeClass('show');
		},

		loadAlbum: function(filter, album, image){
			var rootURL = '';

			if(environment == 'develop'){
				rootURL = 'http://localhost/new/';
			}

			var $imageContainer = module.getSection('photography');
			var $album = module.$albums.find('li[data-album = "' + album + '"]');
			module.$albums.find('.active').removeClass('active');
			$album.addClass('active');

			module.resetScroll();
			module.$images.empty();

			$imageContainer.empty();
			$imageContainer.load(rootURL + 'albums/' + filter + '/' + album, function($el){
				var $images = $(this).find('.photo');
				var imageMenuLinks = [];

				_.each($images, function(image){
					var $image = $(image);
					var id = $image.attr('id');
					var href = $image.find('a[href]').attr('href');
					var name =  $image.find('.picture__caption').text();
					imageMenuLinks.push('<li class="list__item" data-image="' + id + '"><a class="list__link" href="' + href + '">' + name + '</a></li>');
				});

				module.$images.append(imageMenuLinks.join(''));
				module.showImage(image);

				if(environment == 'develop'){
					// Just so the images load properly in development
					$(this).find('img').each(function(index, img){
						$(img).attr({src: 'http://localhost' + $(img).attr('src')});
					})
				}
			});
			$imageContainer.attr('data-album', album);
		},

		showImage: function(image){
			module.scrollTo(image);
			module.current.image = image;

			if(image === undefined){
				image = module.$images.find('li:first-child').attr('data-image');
			}

			module.$images.find('.active').removeClass('active');
			var $image = module.$images.find('li[data-image = "' + image + '"]');
			$image.addClass('active');
		},

		gotoImage: function($image){
			var hash = $image.find('a').attr('href');
			if(hash != undefined){
				window.location.hash = hash;
			}
		},

		hideSection: function(id){
			var $section = module.getSection(id);
			$section.toggleClass('hide', true);
		},

		showSection: function(id){
			var $section = module.getSection(id);
			$section.toggleClass('hide', false);
		},

		getSection: function(id){
			var $section = module.$container.find('[data-section="' + id + '"]');
			return $section;
		},

		scrollTo: function(id, duration){
			var $scrollTarget = module.$scrollContainer.find('#' + id);
			var scrollCurrent, scrollNew

			if($scrollTarget.length == 0){
				// Get the first one instead
				$scrollTarget = module.$scrollContainer.find('article:visible:first');
			}

			if($scrollTarget.length == 0){
				// No articles at all..!
				return;
			}

	    	scrollCurrent = module.$scrollContainer.css('top');
	    	scrollNew = -$scrollTarget.position().top;
	    	$scrollTarget.parent().find('.active').toggleClass('active', false);

	    	if(parseInt(scrollCurrent, 10) == scrollNew){
	      		$scrollTarget.toggleClass('active', true);
	    	}else{
	    		var top = -$scrollTarget.position().top;

		      	module.$scrollContainer.stop().animate({top: top},{
		      		complete: function(){
	      				$scrollTarget.toggleClass('active', true);
	          		}
	        	}, 500);
		    }
		},

		resetScroll: function(){
			module.$scrollContainer.css('top', 0);
		}

	}

	return module;
});