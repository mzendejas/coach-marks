(function($, window, document, undefined){
	$.widget("mobile.coachmarks", $.mobile.widget, {
		//i: false,
		coach_elements: 0,
		coach_images: 0,
		coach_texts: 0,
		coach_objs: [],
		options: {
			modalOpacity: 0.75,
			marks: [],
		},
		$main_div: null,
		_create: function() {
			var self = this;
			//console.log("COACH MARKS INIT");
			this.element.on("pageshow", $.proxy( this._createMarkup, this));
		},
		_reposition: function() {
			var wH = $(window).height(), wW = $(window).width(), self = this;
			this.$main_div.width(wW + 'px').height(wH + 'px').find('div#coach-elements, div#coach-text-elements, div#coach-image-elements, div#coach-modal').width(wW + 'px').height(wH + 'px');
			$.each(this.coach_objs, function(key, value){
				//console.log(value);
				self._editElements( value );
			});
		},
		_createMarkup: function() {
			var self = this, wH = $(window).height(), wW = $(window).width();
			this.$main_div = $('<div id="coach-mark" />').width(wW + 'px').height(wH + 'px');
			this.$main_div.append( '<div id="coach-elements" />' ).append( '<div id="coach-text-elements" style="z-index: 2006;position: absolute;top: 0px;" />' ).append( '<div id="coach-image-elements" style="z-index: 2005;position: absolute;top: 0px;" />' ).append( '<div id="coach-modal" style="background-color:rgba(0,0,0,' + this.options.modalOpacity + ');position:absolute;z-index:2000;top:0px;" />' );
			this.$main_div.find('div#coach-elements, div#coach-text-elements, div#coach-image-elements, div#coach-modal').width(wW + 'px').height(wH + 'px');
			$.each(this.options.marks, function(key, value){
				self.createMark( value );
			});
			this.$main_div.on("click", function(){
				//console.log("CLICKED coach-mark DIV");
				if( typeof self.options.seen === "function" )
				{
					self.options.seen();
				}
				self.destroy();
			});
			$('body').append( this.$main_div );
			$(window).on("resize", $.proxy(this._reposition, this));
		},
		_deleteData: function( $e ){
			switch($e.get(0).tagName)
			{
				case 'A':
					$e.attr('href','').on('click', function(){return false;});
				break;
			}
			return $e;
		},
		createMark: function( o ) {
			var $e = null, $e_pos = null, $copy = null, obj = {};
			if( typeof o.element !== "undefined" )
			{
				$e = (o.element instanceof jQuery) ? o.element : $(o.element) ;
				this.coach_elements++;
				$e_pos = $e.offset();
				obj.element = {};
				obj.element.org = $e;
				if( typeof o.clone === "undefined" || o.clone )
				{
					var parentClassList = $e.parent().attr('class').replace(/ui-/g, "cm-");
					$copy = $e.clone();
					//console.log(parentClassList);
					//' + ( ( typeof parentClassList !== "undefined") ? " " + parentClassList : "" ) + '
					$copy = this._deleteData( $copy ).attr('id', 'coach-element-' + this.coach_elements).wrap('<div class="coach-element" style="position:absolute;z-index:2010;" />').parent().css( { top: $e_pos.top + 'px', left: $e_pos.left + 'px' } );
					if( parentClassList != "" )
					{
						$copy.find("div.coach-element").addClass( parentClassList );
					}
					this.$main_div.find('div#coach-elements').append( $copy );
					obj.element.cloned = $copy;
				}
				//obj.element = { org: $e, cloned: $copy };
			}
			obj.image = this._proccessImage( o.image, "image", $e_pos, true, o );
			obj.text = this._proccessImage( o.text, "text", $e_pos, true, o );
			this.coach_objs.push( obj );
		},
		_proccessImage: function( o, type, relativePos, createMarkup, obj ) {
			if( typeof o !== "undefined" )
			{
				var top = 0, left = 0, $w = $(window), window_wh = { width: $w.width() , height: $w.height() };
				//console.log(typeof o.pos.top, typeof o.pos.top === "function");
				top = ( typeof o.pos.top === "function" ) ? ($.proxy( o.pos.top, o, window_wh, obj, relativePos ))() : relativePos.top + o.pos.top ;
				//top = relativePos.top + o.pos.top;
				left = ( typeof o.pos.left === "function" ) ? ($.proxy( o.pos.left, o, window_wh, obj, relativePos ))() : relativePos.left + o.pos.left;
				if( createMarkup )
				{
					this['coach_' + type + 's']++;
					var $img = $('<div id="coach-' + type + '-' + this['coach_' + type + 's'] + '" style="position:absolute;display:inline-block;z-index: 2006;"><img src="./css/images/' + o.src + '" style="width:100%;" /></div>').css( { top: top + 'px', left: left + 'px' } );
					if( typeof o.containerCss !== "undefined" )
					{
						$img.css( o.containerCss );
					}
					this.$main_div.find('div#coach-' + type + '-elements').append( $img );
					return $.extend( o, { obj: $img } );
				}
				else
				{
					if( typeof o.containerCss !== "undefined" )
					{
						o.obj.css( o.containerCss );
					}
					o.obj.css( { top: top + 'px', left: left + 'px' } );
				}
			}
		},
		_editElements: function( obj ) {
			//console.log("editElements");
			//console.log(obj);
			var $e_pos = obj.element.org.offset();
			obj.element.cloned.css( { top: $e_pos.top + 'px', left: $e_pos.left + 'px' } );
			this._proccessImage( obj.image, "image", $e_pos, false, obj );
			this._proccessImage( obj.text, "text", $e_pos, false, obj );
		},
		destroy: function() {
			this.element.off("pageshow", $.proxy( this._createMarkup, this));
			$(window).off("resize", $.proxy(this._reposition, this));
			this.$main_div.off("click");
			this.$main_div.remove();
		},
	});
}) (jQuery, window, document);