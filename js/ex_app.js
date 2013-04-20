$('div[data-role="page"]').on("pagebeforeshow", function(){
	var cur_page = $.mobile.activePage[0].id;
	if( cur_page == "ex1-page" )
	{
		$.mobile.activePage.coachmarks({
			'marks': { 
				'menuBtn': {
					element: $('a#menu-btn', $.mobile.activePage),
					image: {
						src: "cm_ex1_menu.png",
						pos: {
							top: 25,
							left: -13
						}
					}
				},
				'editBtn': {
					element: $('a#edit-btn', $.mobile.activePage),
					image: {
						src: "cm_ex1_edit.png",
						pos: {
							top: 37,
							left: -129
						}
					}
				}
			}
		});
	}
	else if( cur_page == "ex2-page" )
	{
		$.mobile.activePage.coachmarks({
			'marks': { 
				'liSwipe': {
					element: $('ul#data-list li:first-child', $.mobile.activePage),
					clone: false,
					image: {
						src: "cm_ex2_swipe.png",
						pos: {
							top: 0,
							left: function(w){
								return Math.floor( ( w.width - this.size.w ) / 2 );
							}
						},
						size: { w: 222, h: 135 },
					}
				},
				'tapAnywhere': {
					element: null,
					image: {
						src: "cm_ex2_tapanywhere.png",
						pos: {
							top: function(w){
								return ( w.height - this.size.h ) - 10;
							},
							left: function(w){
								return ( w.width - this.size.w ) - 10;
							}
						},
						size: { w: 229, h: 119 },
					}
				}
			}
		});
	}
	else if( cur_page == "ex3-page" )
	{
		var cm_ex3 = $.cookie("cm-status-ex3");
		if( typeof cm_ex3 === "undefined" )
		{
			$.mobile.activePage.coachmarks({
				seen: function(){
					$.cookie("cm-status-ex3", "seen");
				},
				modalColor:'rgba(0,0,0,0.6)',
				'marks': { 
					'deleteBtn': {
						element: $('a#ex3-delete-btn', $.mobile.activePage),
						clone:true,
						cloneWidth:true,
						css: { 'margin':'0px' },
						image: {
							src: "cm_ex3_button.png",
							pos: {
								top: function(w,o,r){
									return r.top + r.h + 5;
								},
								left: function(w){
									return Math.floor( ( w.width - this.size.w ) / 2 );
								}
							},
							size: { w: 234, h: 82 },
						}
					}
				}
			});
		}
		$("a#ex3-delete-btn", $.mobile.activePage).on("click", function(e){
			e.preventDefault();
			$.removeCookie("cm-status-ex3");
			return false;
		});
	}
});
$('div[data-role="page"]').on("pageshow", function(){
	var cur_page = $.mobile.activePage[0].id;
	/*var modtitle = location.pathname;
	if(location.search)
	{
		modtitle += location.search;
	}
	if(location.hash)
	{
		modtitle += location.hash;
	}*/
	_gaq.push(["_trackPageview", cur_page]);
	if( cur_page == "ex2-page" )
	{
		$('ul#data-list li', $.mobile.activePage).swipemenu({ 
				buttons: [
						{
						 text: "Action 1",
						 attributes: {
							 "data-theme": "a",
							 "href": "#"
						},
						click: function(e){
							e.preventDefault();
							alert("You clicked Action 1 button");
							}
					},
					{
						 text: "Action 2",
						 attributes: {
							 "data-theme": "b", 
							 "href": "#"
						},
						click: function(e){
							e.preventDefault();
							alert("You clicked Action 2 button");
							}
					},
				] 
		});
	}
});