(function($, window, document, undefined){
	$.widget("mobile.swipemenu", $.mobile.widget, {
			 options: {
				 containerClass: "div-swipe",
				 buttons: []
				 /*
				 buttons: [
						{
						 text: "Button one",
						 attributes: {
							 "data-theme": "a", 
						}
					},
					{
						 text: "Button two",
						 attributes: {
							 "data-theme": "b", 
						}
					},
				]
				 */
			 },
			_init: function() {
				var self = this;
				$('.' + this.options.containerClass).remove();
				console.log("SWIPE MENU INIT");
				this.element.unbind('swiperight').bind('swiperight', function(e){
					var $li = $(this), me = self;
					$('.' + self.options.containerClass).remove();
					var $divSwipe = $('<div class="' + self.options.containerClass + '"></div>');
					$li.prepend($divSwipe);
					$.each(self.options.buttons, function(key, value){
						console.log(value);
						$divSwipe.prepend( me._createButton( value ) );
					});
					/*var $myBtn01 = $('<a>Button One</a>')
							.attr({
								'class': 'aSwipeBtn ui-btn-up-b',
								'href': 'page.html'
							});
					var $myBtn02 = $('<a>Button Two</a>')
							.attr({
								'class': 'aSwipeBtn ui-btn-up-e',
								'href': 'page.html'
							});*/
					$divSwipe.show(100);
					$('body').bind('tap', function(e){
						if (e.target.className.indexOf('swipemenu-btn') >= 0) $(e.target).trigger('click'); 
						$('.' + me.options.containerClass).remove();
						// remove the event
						$('body').unbind('tap');
					});
				});
			 },
			 _createButton: function(v) {
				 if( typeof v.attributes.class !== "undefined" )
				 {
					 v.attributes.class += " swipemenu-btn";
				 }
				 else
				 {
					 v.attributes.class = "swipemenu-btn";
				 }
				 v.attributes['data-inline'] = "true";
				 var $btn = $('<a data-role="button">' + v.text + '</a>').attr( v.attributes ).button();
				 if(typeof v.click === "function")
				 {
					 $btn = $btn.on('click', v.click);
				 }
				return $btn;
			 }
	});
}) (jQuery, window, document);