/**********************************************************
 * PANOPTICON v0.2                                        *
 * A really, really simple jQuery carousel                *
 * made by Grey Hargreaves (greysadventures.com)          *
 * for the Bristol Bronies website (bristolbronies.co.uk) *
***********************************************************/

(function($) {

	$.fn.panopticon = function(options) {
		this.each(function() {
			var $element = $(this);

			var settings = $.extend({
				'debug'    : false,
				'controls' : true,
				'touch'    : true
			}, options);
			
			var elementIdentifier = "PO" + Math.round((Math.random() * 1000) + 1000),
			    currentSlide = 1,
			    totalSlides = 1,
			    touchStartX = undefined,
			    touchMoveX = undefined,
			    moveX = undefined;

			this.init = function() {
				if(settings.debug) console.log("[" + elementIdentifier + "] Panopticon initialised.");
				var self = this;
				self.addContainer();
				self.buildSlider();
				if(settings.controls === true) self.bindControls();
				if(settings.touch === true) self.bindTouch();
				$(window).resize(function() {
					setTimeout(function() {
						self.buildSlider();
						self.gotoSlide(currentSlide);
					}, 500);
				});
			}

			this.addContainer = function() {
				if($element.children(".panopticon__container").length == 0) {
					$element.wrapInner('<div class="panopticon__container"></div>');
					if(settings.debug) console.log("[" + elementIdentifier + "] Added wrapping container.");
				}
			}

			this.buildSlider = function() {
				$element.find(".panopticon__slide").css({ "padding": "" });
				var slides = $element.find(".panopticon__slide"),
				    slideWidth = $element.outerWidth(),
				    totalSlidesWidth = 0,
				    containerHeight = $element.find(".panopticon__container").height();
				totalSlides = slides.length;
				for(var i = 0; i < totalSlides; ++i) {
					var $thisSlide = $(slides[i]);
					var padding = ((containerHeight - $thisSlide.height()) / 2);
					$thisSlide.css({"width": slideWidth + "px", "padding": padding + "px 0"});
					totalSlidesWidth = totalSlidesWidth + slideWidth;
				}
				$element.find(".panopticon__container").css({"width": totalSlidesWidth + "px"});
				if(settings.debug) console.log("[" + elementIdentifier + "] Built slider. Slide width: " + slideWidth + "px. Total width: " + totalSlidesWidth + "px.");
			}

			this.gotoSlide = function(slideNumber) {
				var offset = 0,
				    slideWidth = $element.outerWidth();
				if(slideNumber > totalSlides) { 
					slideNumber = 1; 
				}
				else if(slideNumber <= 0) {
					slideNumber = totalSlides;
				}
				currentSlide = slideNumber;
				offset = (0 - (slideWidth * (slideNumber - 1)));
				$element.find(".panopticon__container").css({"transform": "translateX(" + offset + "px)"});
				if(settings.debug) console.log("[" + elementIdentifier + "] Go to slide " + slideNumber +". Offset: " + offset + "px.");
			}

			this.bindControls = function() {
				var self = this;
				$element.append('<div class="panopticon__controls"></div>');
				$element.find(".panopticon__controls").append('<div class="panopticon__control panopticon__control--previous"><a href="#" class="js-panopticon-prev"><span class="fa fa-fw fa-chevron-left"></span></a></div>');
				$element.find(".panopticon__controls").append('<div class="panopticon__control panopticon__control--next"><a href="#" class="js-panopticon-next"><span class="fa fa-fw fa-chevron-right"></span></a></div>');
				$element.find(".js-panopticon-prev").on("click", function(e) {
					e.preventDefault();
					self.gotoSlide(currentSlide - 1);
				});
				$element.find(".js-panopticon-next").on("click", function(e) {
					e.preventDefault();
					self.gotoSlide(currentSlide + 1);
				});
			}

			this.bindTouch = function() {
				var self = this;
				$element.on("touchstart", function(e) {
					touchStartX = e.originalEvent.touches[0].pageX;
				});
				$element.on("touchmove", function(e) {
					var slideWidth = $element.outerWidth();
					touchMoveX = e.originalEvent.touches[0].pageX;
					moveX = currentSlide * slideWidth + (touchStartX - touchMoveX);
				});
				$element.on("touchend", function(e) {
					var self = this,
					    slideWidth = $element.outerWidth(),
					    absMove = Math.abs(currentSlide * slideWidth - moveX);
					if(absMove > slideWidth/3) {
						if(moveX < (currentSlide * slideWidth)) {
							self.gotoSlide(currentSlide - 1);
						}
						else if(moveX > (currentSlide * slideWidth)) {
							self.gotoSlide(currentSlide + 1);
						}
					}
				});
			}

			return this.init();

		});

	}

})(jQuery);