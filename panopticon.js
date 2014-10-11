/**********************************************************
 * PANOPTICON v0.1                                        *
 * A really, really simple jQuery carousel                *
 * made by Grey Hargreaves (greysadventures.com)          *
 * for the Bristol Bronies website (bristolbronies.co.uk) *
***********************************************************/

function Panopticon(config) {
	this.context = config.context;
	this.debug = typeof config.debug !== 'undefined' ? config.debug : false;
	this.controls = typeof config.controls !== 'undefined' ? config.controls : true;

	this.currentSlide = 1;
	this.totalSlides = 1;

	this.init();
};

Panopticon.prototype.init = function() {
	if(this.debug) console.log("Panopticon initialised.");
	var self = this;
	this.addContainer();
	this.buildSlider();
	if(this.controls === true) {
		this.bindControls();
	}
	$(window).resize(function() {
		setTimeout(function() {
			self.buildSlider();
			self.gotoSlide(self.currentSlide);
		}, 500);
	});
};

Panopticon.prototype.addContainer = function() {
	if(this.context.children(".panopticon__container").length == 0) {
		this.context.wrapInner('<div class="panopticon__container"></div>');
		if(this.debug) console.log("Added wrapping container.");
	}
};

Panopticon.prototype.buildSlider = function() {
	var slides = this.context.find(".panopticon__slide"),
	    slideWidth = this.context.outerWidth(),
	    totalSlidesWidth = 0;
	this.totalSlides = slides.length;
	for(var i = 0; i < this.totalSlides; ++i) {
		var $thisSlide = $(slides[i]);
		$thisSlide.css({"width": slideWidth + "px"});
		totalSlidesWidth = totalSlidesWidth + slideWidth;
	}
	this.context.find(".panopticon__container").css({"width": totalSlidesWidth + "px"});
	if(this.debug) console.log("Slide width: " + slideWidth + "px. Total width: " + totalSlidesWidth + "px.");
};

Panopticon.prototype.gotoSlide = function(slideNumber) {
	var offset = 0,
	    slideWidth = this.context.outerWidth();
	if(slideNumber > this.totalSlides) { 
		slideNumber = 1; 
	}
	else if(slideNumber <= 0) {
		slideNumber = this.totalSlides;
	}
	this.currentSlide = slideNumber;
	offset = (0 - (slideWidth * (slideNumber - 1)));
	this.context.find(".panopticon__container").css({"margin-left": offset + "px"});
	if(this.debug) console.log("Go to slide " + slideNumber +". Offset " + offset + "px.");
};

Panopticon.prototype.bindControls = function() {
	var self = this;
	this.context.append('<div class="panopticon__controls"></div>');
	this.context.find(".panopticon__controls").append('<div class="panopticon__control panopticon__control--previous"><a href="#" class="js-panopticon-prev"><span class="fa fa-fw fa-chevron-left"></span></a></div>');
	this.context.find(".panopticon__controls").append('<div class="panopticon__control panopticon__control--next"><a href="#" class="js-panopticon-next"><span class="fa fa-fw fa-chevron-right"></span></a></div>');
	this.context.find(".js-panopticon-prev").on("click", function(e) {
		e.preventDefault();
		self.gotoSlide(self.currentSlide - 1);
	});
	this.context.find(".js-panopticon-next").on("click", function(e) {
		e.preventDefault();
		self.gotoSlide(self.currentSlide + 1);
	});
};
