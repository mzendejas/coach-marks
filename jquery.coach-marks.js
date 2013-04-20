/*!
 * jQuery Mobile Coach Marks Plugin v0.4
 * https://github.com/mzendejas/coach-marks
 *
 * Copyright 2013 Manuel Zendejas
 * Released under the MIT license
 */
(function($, window, document, undefined){
	$.widget("mobile.coachmarks", $.mobile.widget, {
		coach_elements: 0,
		coach_images: 0,
		coach_texts: 0,
		coach_objs: [],
		options: {
			modalColor: 'rgba(0, 0, 0, 0.75)',
			marks: [],
		},
		$main_div: null,
		_init: function() {
			this.element.on("pageshow", $.proxy( this._createMarkup, this));
		},
		_create: function() {
		},
		_reposition: function() {
			var wH = $(window).height(), wW = $(window).width(), self = this;
			this.$main_div.width(wW + 'px').height(wH + 'px').find('div#coach-elements, div#coach-text-elements, div#coach-image-elements, div#coach-modal').width(wW + 'px').height(wH + 'px');
			$.each(this.coach_objs, function(key, value){
				self._editElements( value );
			});
		},
		_createMarkup: function() {
			this.destroy();
			var self = this, wH = $(window).height(), wW = $(window).width();
			this.$main_div = $('<div id="coach-mark" />').width(wW + 'px').height(wH + 'px');
			this.$main_div.append( '<div id="coach-elements" />' ).append( '<div id="coach-text-elements" style="z-index: 2006;position: absolute;top: 0px;" />' ).append( '<div id="coach-image-elements" style="z-index: 2005;position: absolute;top: 0px;" />' ).append( '<div id="coach-modal" style="background-color:' + this.options.modalColor + ';position:absolute;z-index:2000;top:0px;" />' );
			this.$main_div.find('div#coach-elements, div#coach-text-elements, div#coach-image-elements, div#coach-modal').width(wW + 'px').height(wH + 'px');
			$.each(this.options.marks, function(key, value){
				self.createMark( value );
			});
			this.$main_div.on("click", function(){
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
			var $e = null, $e_pos = { top:0, left:0 }, $e_wh = { w:0, h:0 }, $e_props = {}, $copy = null, obj = {};
			if( typeof o.element !== "undefined" && o.element != null )
			{
				$e = (o.element instanceof jQuery) ? o.element : $(o.element) ;
				this.coach_elements++;
				$e_pos = $e.offset();
				$e_wh = { w: $e.width(), h: $e.height() };
				obj.element = {};
				obj.element.org = $e;
				if( typeof o.clone === "undefined" || o.clone )
				{
					var parentClassList = $e.parent().attr('class').replace(/ui-/g, "cm-");
					$copy = $e.clone();
					$copy = this._deleteData( $copy ).attr('id', 'coach-element-' + this.coach_elements).wrap('<div class="coach-element" style="position:absolute;z-index:2010;" />').parent().css( { top: $e_pos.top + 'px', left: $e_pos.left + 'px' } );
					obj.element.clone = true;
					if( parentClassList != "" )
					{
						$copy = $copy.addClass( parentClassList );
					}
					var $first = null;
					if( typeof o.cloneWidth !== "undefined" && o.cloneWidth )
					{
						$first = $copy.children(':first').width( $e.width() );
						obj.element.cloneWidth = o.cloneWidth;
					}
					if( typeof o.css !== "undefined" )
					{
						$first.css( o.css );
						obj.element.css = o.css;
					}
					this.$main_div.find('div#coach-elements').append( $copy );
					obj.element.cloned = $copy;
				}
			}
			$e_props = $.extend($e_props, $e_pos, $e_wh);
			obj.image = this._proccessImage( o.image, "image", $e_props, true, o );
			obj.text = this._proccessImage( o.text, "text", $e_props, true, o );
			this.coach_objs.push( obj );
		},
		_proccessImage: function( o, type, relativePos, createMarkup, obj ) {
			if( typeof o !== "undefined" )
			{
				var top = 0, left = 0, $w = $(window), window_wh = { width: $w.width() , height: $w.height() };
				top = ( typeof o.pos.top === "function" ) ? ($.proxy( o.pos.top, o, window_wh, obj, relativePos ))() : relativePos.top + o.pos.top ;
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
			var $e_pos = obj.element.org.offset(), $e_wh = { w:0, h:0 }, $e_props = {};
			$e_wh = { w: obj.element.org.width(), h: obj.element.org.height() };
			obj.element.cloned.css( { top: $e_pos.top + 'px', left: $e_pos.left + 'px' } );
			if( typeof obj.element.cloneWidth !== "undefined" && obj.element.cloneWidth )
			{
				obj.element.cloned.children(':first').width( obj.element.org.width() );
			}
			$e_props = $.extend($e_props, $e_pos, $e_wh);
			this._proccessImage( obj.image, "image", $e_props, false, obj );
			this._proccessImage( obj.text, "text", $e_props, false, obj );
		},
		destroy: function() {
			this.element.off("pageshow", $.proxy( this._createMarkup, this));
			$(window).off("resize", $.proxy(this._reposition, this));
			if( this.$main_div != null )
			{
				this.$main_div.off("click").remove();
			}
		},
	});
}) (jQuery, window, document);