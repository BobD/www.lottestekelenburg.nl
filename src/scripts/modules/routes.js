define(['underscore'], function(_) {

	var module = {

		init: function(options){
			// https://github.com/flatiron/director
			var routes = {};
			var archivePath = '/' + archiveURL;
			var photographyPath = '/' + photographyURL;
			var informationPath = '/' + informationURL;

			routes[archivePath + '/:filter'] = function(filter) {
		    	module.showArticle(filter);
		    }

			routes[archivePath + '/:filter/:id'] = function(filter, article) {
		    	module.showArticle(filter, article);
		    }

		    routes[photographyPath + '/:filter'] = function(filter) {
		    	module.showPhoto(filter);
		    }

		    routes[photographyPath + '/:filter/:album'] = function(filter, album) {
		    	module.showPhoto(filter,  album);
		    }

		    routes[photographyPath + '/:filter/:album/:image'] = function(filter, album, image) {
		    	module.showPhoto(filter,  album, image);
		    }

		  var router = Router(routes);
		  router.init();
		},

		showArticle: function(filter, article){
		   	require('information').hide();
		    require('archive').filter(filter, article);
		    require('content').listArticles(filter, article);
		},

		showPhoto: function(filter,  album, image){
	    	require('archive').hide();
	    	require('information').hide();
	    	require('content').listAlbums(filter, album, image);
		}

	}

	return module;
});