define(['underscore'], function(_) {

	var module = {
		init: function(options){


			// https://github.com/flatiron/director
		  var routes = {};
			var archivePath = '/' + archiveURL;
			var photographyPath = '/' + photographyURL;
			var informationPath = '/' + informationURL;

		  routes[archivePath + '/:filter'] = function(filter) {
	   		require('information').hide();
	   		require('archive').show();
	    	require('archive').filter(filter, true);
	    	require('content').listArticles(filter, true);
	    	require('mobile').update();
	    }

		  routes[archivePath + '/:filter/:id'] = function(filter, id) {
	    	require('information').hide();
	   		require('archive').show(id);
	    	require('archive').filter(filter);
	    	require('content').listArticles(filter);
	    	require('content').showArticle(id);
	    	require('mobile').update();
	    }

	    routes[photographyPath + '/:filter'] = function(filter) {
	    	require('archive').hide();
	    	require('information').hide();
	    	require('content').listAlbums(filter, true);
	    	require('mobile').update();
	    }

	    routes[photographyPath + '/:filter/:album'] = function(filter, album) {
	    	require('archive').hide();
	    	require('information').hide();
	    	require('content').listAlbums(filter);
	    	require('content').loadAlbum(location.hash);
	    	require('mobile').update();
	    }

	    routes[photographyPath + '/:filter/:album/:image'] = function(filter, album, image) {
	    	require('archive').hide();
	    	require('information').hide();
	    	require('content').listAlbums(filter);
	    	require('content').loadAlbum(location.hash);
	    }

		  var router = Router(routes);

    //  	router.configure({
				// html5history: true
    //   });

		  router.init();
		}

	}

	return module;
});