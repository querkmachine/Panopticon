/**********************************************************
 * PANOPTICON v1.0.1                                      *
 * A really, really simple jQuery carousel                *
 * made by Grey Hargreaves (greysadventures.com)          *
 * for the Bristol Bronies website (bristolbronies.co.uk) *
***********************************************************/

;(function($, window, document, undefined) {

	"use strict";

		var pluginName = "panopticon";
		var defaults = {
		    debug: false,
		    arrows: true,
		    pips: true,
		    touch: true
		};

		function Plugin(element, options) {
			this.$element = $(element);
			this.$container = undefined;
			this.identifier = "PO" + Math.round((Math.random() * 1000) + 1000);
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;

			this.nextText = "Next";
			this.prevText = "Previous";

			this.containerClass = "panopticon__container";
			this.slideClass = "panopticon__slide";
			this.arrowsClass = "panopticon__controls";
			this.pipsClass = "panopticon__pips";

			this.currentSlide = 1;
			this.totalSlides = 1;

			this.init();
		}

		$.extend(Plugin.prototype, {

			init: function () {
				if(this.settings.debug) console.log("[" + this.identifier + "] Panopticon initialised.");
				this.addContainer();
				this.buildSlider();
				if(this.settings.arrows) this.buildArrows();
				if(this.settings.pips) this.buildPips(); this.gotoSlide(1);
				this.bindControls();
				if(this.settings.touch) this.bindTouch();
				this.bindResize();
			},

			addContainer: function() {
				if(this.$element.children("." + this.containerClass).length < 1) {
					this.$element.wrapInner("<div class=\"" + this.containerClass + "\"></div>");
					if(this.settings.debug) console.log("[" + this.identifier + "] Add wrapper container.");
				}
				this.$container = this.$element.find("." + this.containerClass);
			},

			buildSlider: function() {
				var slides = this.$element.find("." + this.slideClass),
				    slideWidth = this.$element.outerWidth(),
				    totalWidth = 0;
				this.totalSlides = slides.length;
				for(var i = 0; i < this.totalSlides; ++i) {
					var $thisSlide = $(slides[i]);
					$thisSlide.css({"width": slideWidth + "px"});
					totalWidth += slideWidth;
				}
				this.$container.css({"width": totalWidth + "px"});
				if(this.settings.debug) console.log("[" + this.identifier + "] Built slider. Slide width: " + slideWidth + "px. Total width: " + totalWidth + "px.");
			},

			gotoSlide: function(slideNumber) {
				var offset = 0,
				    slideWidth = this.$element.outerWidth();
				if(slideNumber > this.totalSlides) {
					slideNumber = 1;
				}
				else if(slideNumber <= 0) {
					slideNumber = this.totalSlides;
				}
				this.currentSlide = slideNumber;
				offset = (0 - (slideWidth * (slideNumber - 1)));
				this.$container.css({"transform": "translateX(" + offset + "px)"});
				if(this.settings.debug) console.log("[" + this.identifier + "] Go to slide " + slideNumber +". Offset: " + offset + "px.");
				if(this.settings.pips) {
					var $pipsContainer = this.$element.find("." + this.pipsClass);
					$pipsContainer.find("li").removeClass("current");
					$pipsContainer.find("[data-panopticon-slide='" + slideNumber + "']").parent().addClass("current");
				}
			},

			buildArrows: function() {
				this.$element.append("<ul class=\"" + this.arrowsClass + "\"><li><a href=\"#\" data-panopticon-slide=\"prev\">" + this.prevText + "</a></li><li><a href=\"#\" data-panopticon-slide=\"next\">" + this.nextText + "</a></li></ul>");
				if(this.settings.debug) console.log("[" + this.identifier + "] Built arrows.");
			},

			buildPips: function() {
				this.$element.append("<ul class=\"" + this.pipsClass + "\"></ul>");
				var pipsLinks = "";
				for(var i = 0; i < this.totalSlides; ++i) {
					var gotoSlide = (i + 1);
					pipsLinks += "<li><a href=\"#\" data-panopticon-slide=\"" + gotoSlide + "\">" + gotoSlide + "</a></li>";
				}
				this.$element.find("." + this.pipsClass).append(pipsLinks);
				if(this.settings.debug) console.log("[" + this.identifier + "] Built pips.");
			},

			bindControls: function() {
				var self = this;
				self.$element.find("[data-panopticon-slide]").on("click", function(e) {
					e.preventDefault();
					var gotoSlide = $(this).attr("data-panopticon-slide").toLowerCase();
					switch(gotoSlide) {
						case "prev":
							self.gotoSlide(self.currentSlide - 1);
							break;
						case "next":
							self.gotoSlide(self.currentSlide + 1);
							break;
						default:
							self.gotoSlide(gotoSlide); 
							break;
					}
				});
				if(this.settings.debug) console.log("[" + this.identifier + "] Bound link controls.");
			},

			bindTouch: function() {
				var self = this,
				    slideWidth = this.$element.outerWidth(),
				    touchStartX = undefined,
				    touchMoveX = undefined,
				    moveX = undefined;
				this.$element.on("touchstart", function(e) {
					touchStartX = e.originalEvent.touches[0].pageX;
				});
				this.$element.on("touchmove", function(e) {
					touchMoveX = e.originalEvent.touches[0].pageX;
					moveX = self.currentSlide * slideWidth + (touchStartX - touchMoveX);
				});
				this.$element.on("touchend", function(e) {
					var absMove = Math.abs(self.currentSlide * slideWidth - moveX);
					if(absMove > (slideWidth / 3)) {
						if(moveX < (self.currentSlide * slideWidth)) {
							self.gotoSlide(self.currentSlide - 1);
						}
						else if(moveX > (self.currentSlide * slideWidth)) {
							self.gotoSlide(self.currentSlide + 1);
						}
					}
				});
				if(this.settings.debug) console.log("[" + this.identifier + "] Bound touch controls.");
			},

			bindResize: function() {
				var self = this;
				$(window).resize(function() {
					setTimeout(function() {
						self.buildSlider();
						self.gotoSlide(self.currentSlide);
					}, 500);
				});
			}

		});

		$.fn[ pluginName ] = function(options) {
			return this.each(function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
				}
			});
		};

})(jQuery, window, document);