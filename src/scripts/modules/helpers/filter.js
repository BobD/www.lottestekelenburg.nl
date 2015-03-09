define([], function() {

	var Filter = function(options){
		var base = this;
		var $link;

		this.onFilter = options.onFilter;
		this.$filter = options.$filter;
		this.$links = this.$filter.find('li');
		this.toggle = this.$links.length == 1;

		this.$links.on('click', function(e){
			var $item = $(e.currentTarget);

			if(!base.toggle){
				base.$filter.find('.active').toggleClass('active', false);
				$item.toggleClass('active', true);
			}else{
				e.preventDefault();
				var active = $item.hasClass('active');
				$item.toggleClass('active', !active);
			}

			if(base.onFilter){
				base.onFilter({
					filters: $item.data('filters')
				});
			}
		});
	}

	Filter.prototype.clear = function(){
		this.$filter.find('.active').toggleClass('active', false);
	};

	Filter.prototype.trigger = function(){
		this.$links.first().trigger('click');
	};

	Filter.prototype.activate = function(filters){
		this.$filter.find('.active').toggleClass('active', false);
		this.$filter.find('[data-filters="' + filters + '"]').toggleClass('active', true);
	};

	return Filter;
});