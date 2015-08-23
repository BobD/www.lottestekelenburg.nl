module.exports = function(grunt) {
	var _ = require("underscore");
	var path  = require('path');
	// var libxmljs = require("libxmljs");
	var data = {
		archive: {items: []},
		about: []
	}

	grunt.registerTask('data', 'Loads testing data', function() {
		var dataFiles = grunt.file.expand('src/data/*.json');
		var id, json;

		_.each(dataFiles, function(file){
			id = path.basename(file, '.json');
			json = grunt.file.readJSON(file);
			data[id] = json;
		});

		// grunt.task.run('xml');
		grunt.option('data', data);
	});

	// grunt.registerTask('xml', 'Converts old XML config to some workable Javascript objects', function() {
	// 	var xmlConfig = grunt.file.read('src/data/config.xml');
	// 	var xmlDoc = libxmljs.parseXml(xmlConfig);
	// 	var info = xmlDoc.get('//over/item');
	// 	var agendaItems = xmlDoc.find('//agenda/item');
	// 	var articleID;
	// 	var archiveItems = data['archive'].items;

	// 	data['about'] = {
	// 		title: info.attr('label').value(),
	// 		text: info.get('description').childNodes().join('').toString(),
	// 	};

	// 	_.each(agendaItems, function(item){
	// 		archiveItems.push({
 //    		title: item.get('header').text(),
 //    		id: item.get('header').text().toLowerCase().replace(/ /g, '-'),
 //    		image: item.get('image').text(),
 //    		text: item.get('description').childNodes().join('').toString(),
 //    		created: {
 //    			date: item.get('filters').attr('date').value(),
 //    			year: item.get('filters').attr('year').value()
 //    		},
 //    		category: item.get('filters').attr('color').value()
 //    	});
	// 	});

	// });

};