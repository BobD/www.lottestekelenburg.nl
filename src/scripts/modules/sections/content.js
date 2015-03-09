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

				var next = $(this).next().find('a').attr('href')
				window.location.hash = next;
			});

			// Return to the first if the active one is the last
			module.$scrollContainer.on('click', '.photo:last-child', function(e){
				if($(this).hasClass('active')){
					e.preventDefault();

					var first = $(this).siblings().first().find('a').attr('href')
					window.location.hash = first;
				}
			});

			// BOB::20150130, articles do not have an a[href] with direct links container like photo's
			module.$scrollContainer.on('click', '.article:not(.active)', function(e){
				e.preventDefault();

				var filter = $(this).attr('data-filters');
				var album = $(this).attr('album');
				var id = $(this).attr('id');

				$('body').scrollTop(0);
				window.location.hash = '/' + archiveURL + '/' + filter + '/' + id;
			});
		},

		initArticles: function(){
			module.hideSection('intro');
			module.hideSection('photography');
			module.showSection('articles');
		},

		listArticles: function(filter, loadFirstArticle){
			module.initArticles();
			module.$scrollContainer.attr('data-filters', filter);

			if(loadFirstArticle){
				module.showArticle();
			}

			module.current.filter = filter;
		},

		showArticle: function(article){
			module.hideAlbums();
			module.$images.empty();
			module.nav.clear();
			// module.resetScroll();
			module.scrollTo(article);
			module.$container.attr('data-filters', 'archive');
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

		listAlbums: function(filter, loadFirstAlbum){
			module.hideAlbums();

			var $albumList = module.$albums.find('*[data-filter="' + filter + '"]');
			$albumList.addClass('show');

			module.initPhotography();
			module.nav.activate(filter);
			module.current.filter = filter;

			if(loadFirstAlbum){
				$album = $albumList .find('li').first();
				album = $album.attr('data-album');
				module.loadAlbum($album.find('a').attr('href'));
			}
		},

		hideAlbums: function(){
			module.$albums.find('*[data-filter]').removeClass('show');
		},

		loadAlbum: function(url){
			var urlSplit = url.split('/');
			var filter = urlSplit[2];
			var album = urlSplit[3];
			var image = urlSplit[4];

			if(environment != 'develop'){
				var $imageContainer = module.getSection('photography');
				var $album = module.$albums.find('li[data-album = "' + album + '"]');
				$album.addClass('active');

				if($imageContainer.attr('data-album') != album){
					module.resetScroll();

					$imageContainer.empty();
					$imageContainer.load('albums/' + album, function($el){
						var $images = $(this).find('.photo');
						var imageMenuLinks = [];
						_.each($images, function(image){
							var $image = $(image);
							var id = $image.attr('id');
							var href = $image.find('a[href]').attr('href');
							var name =  $image.find('.picture__caption').text();
							imageMenuLinks.push('<li data-image="' + id + '"><a href="' + href + '">' + name + '</a></li>');
						});
						module.$images.empty();
						module.$images.append(imageMenuLinks.join(''));
						module.showImage(image);
					});
					$imageContainer.attr('data-album', album);
				}else{
					module.showImage(image);
				}

			}else{
				if(album != module.current.album){
					var $album = module.$albums.find('li[data-album = "' + album + '"]');
					var $imageContainer = module.getSection('photography');
					$album.addClass('active');
					$imageContainer.empty();

					module.resetScroll();
					module.$albums.find('.active').removeClass('active');

					$.ajax({
		       type: 'GET',
		        url: albumsFeed + album + '.json?callback=?',
		        jsonpCallback: 'jsonCallback',
		        contentType: "application/json",
		        dataType: 'jsonp',
		        success: function(json) {
		          module.loadImages(json.album.images);
		          module.showImage(image);
		        },
		        error: function(e) {}
			    });
				}else{
					module.showImage(image);
				}
			}

			module.current.album = album;
		},

		loadImages: function(images){
			var $imageContainer = module.getSection('photography');
			var imageList = [];
			var menuList = [];
			var src, link;

			// Keep the HTML markup for this article type in sync with the handlebars template in templates/helpers/photo.hbs
			// loadImages() is only called in the prototype, no need to drag Handlebars as a dependency in content.js for production
			_.each(images, function(img){
				src = 'http://' + img.location + '/' + img.hash + '_large_mobile.jpg';
				link = '#/' + photographyURL + '/' + module.current.filter + '/' + module.current.album + '/' + img.id;
				imageList.push('<article class="photo" id="' + img.id + '"><a href="' + link + '"><picture class="picture"><img src="' + src + '" alt="' + img.name  + '" class="picture__image"><figcaption class="picture__caption">' + img.name + '</figcaption></picture></a></article>');
				menuList.push('<li data-image="' + img.id + '"><a href="' + link + '">' + img.name + '</a></li>');
			});

			$imageContainer.empty();
			$imageContainer.append(imageList.join(''));

			module.$images.empty();
			module.$images.append(menuList.join(''));
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
				$scrollTarget = module.$scrollContainer.find('article:visible:first');
			}

    	scrollCurrent = module.$scrollContainer.css('top');
    	scrollNew = -$scrollTarget.position().top;

    	$scrollTarget.parent().find('.active').toggleClass('active', false);

    	if(parseInt(scrollCurrent, 10) == scrollNew){
      	$scrollTarget.toggleClass('active', true);
    	}else{
    		var top = -$scrollTarget.position().top;

	      module.$scrollContainer.stop().animate({
          top: top,
        },{
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